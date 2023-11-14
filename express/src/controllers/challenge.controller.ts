import { Request, Response } from 'express';
import { APIResponse } from '../interfaces/APIResponse';
import client from '../Client';
import validateSession from '../auth/session';

/**
 * Returns a list challenges. If a guest or normal user, only returns released challenges. If an administrator, returns
 * all challenges regardless of release status.
 *
 * @param req The HTTP request.
 * @param res The HTTP response, implements the APIResponse interface.
 */
export async function getAll(req: Request, res: Response<APIResponse>)
{
	/* Returning all challenges, if the client is an administrator.
	 */
	if (await validateSession(String(req.headers.authorization).split(' ')[1], true))
	{
		await client.challenge.findMany({
			orderBy: [
				{
					id: 'asc',
				},
				{}
			],
			include: {
				attachments: true,
				category: true,
				wave: true,
			}
		}).then((challenges) =>
		{
			res.status(200).json({
				success: true,
				data: {
					challenges: challenges
				}
			});
		});
	}
	/* Returning only released challenges, for non-admin users.
	 */
	else
	{
		const released = await client.challenge.findMany({
			select: {
				id: true,
				title: true,
				body: true,
				value: true,
				category: true,
				attachments: true,
				wave: true,
			},
			where: {
				categoryId: {
					not: null,
				},
				wave: {
					releaseDate: {
						lte: new Date(),
					}
				},
			}
		});

		const unreleased = await client.challenge.findMany({
			select: {
				id: true,
				title: true,
				value: true,
				category: true,
				wave: true,
			},
			where: {
				categoryId: {
					not: null,
				},
				wave: {
					releaseDate: {
						gte: new Date(),
					}
				},
			}
		});

		/* Combining the unreleased and released array.
		 */
		let challenges: any[] = released;
		challenges = challenges.concat(unreleased);

		res.status(200).json({
			success: true,
			data: {
				challenges: challenges,
			}
		});
	}
}

/**
 * Creates a challenge entry in the database.
 *
 * @param req The HTTP request.
 * @param res The HTTP response, implements the APIResponse interface.
 */
export async function create(req: Request, res: Response<APIResponse>)
{
	await client.challenge.create({
		data: {
			categoryId: parseInt(req.body['categoryId']),
			waveId: parseInt(req.body['waveId']),
			value: parseInt(req.body['value']),
			title: req.body['title'],
			body: req.body['body'],
			flag: req.body['flag'],
		}
	})
		.then(() =>
		{
			res.status(200).json({
				success: true,
			});
		})
		.catch(() =>
		{
			res.status(400).json({
				success: false,
			});
		})
}

/**
 * Updates a challenges data in the database.
 * @param req The HTTP request.
 * @param res The HTTP response, implements the APIResponse interface.
 */
export async function update(req: Request, res: Response<APIResponse>)
{
	await client.challenge.update({
		where: {
			id: parseInt(req.params['id']),
		},
		data: {
			categoryId: parseInt(req.body['categoryId'], 10),
			waveId: parseInt(req.body['waveId'], 10),
			value: parseInt(req.body['value'], 10),
			title: req.body['title'],
			body: req.body['body'],
			flag: req.body['flag'],
		}
	}).then(() =>
	{
		res.status(200).json({
			success: true,
		});
	}).catch(() =>
	{
		res.status(400).json({
			success: false,
		});
	});
}

/**
 * Removes a challenge entry from the database. Cascades down the deletion to attachments as well.
 *
 * @param req The HTTP request.
 * @param res The HTTP response, implements the APIResponse interface.
 */
export async function remove(req: Request, res: Response<APIResponse>)
{
	await client.challenge.delete({
		where: {
			id: parseInt(req.params['id']),
		},
	}).then(() =>
	{
		res.status(200).json({
			success: true,
		});
	}).catch(() =>
	{
		res.status(400).json({
			success: false,
		});
	});
}

/**
 * Attempts to solve a challenge.
 *
 * @param req The HTTP request.
 * @param res The HTTP response, implements the APIResponse interface.
 */
export async function solve(req: Request, res: Response<APIResponse>)
{
	/* Seeing if the client solved the flag.
	 */
	const solved = await client.challenge.findUnique({
		where: {
			id: parseInt(req.params['id']),
			flag: req.body['flag'],
		},
	}).then((challenge) =>
	{
		return !!challenge;
	}).catch(() =>
	{
		return false;
	});

	if (solved)
	{
		/* Getting the client teamId.
		 */
		await client.user.findFirst({
			where: {
				session: {
					key: {
						equals: String(req.headers.authorization).split(' ')[1],
					}
				}
			}
		}).then(async (user) =>
		{
			/* Validating that the user session is valid.
			 */
			if (!(user && user.teamId))
			{
				res.status(403);
				return;
			}

			/* Validating that the team has not already solved this challenge.
			 */
			const captures = await client.capture.findMany({
				where: {
					teamId: user.teamId,
					challengeId: parseInt(req.params['id']),
				}
			});

			if (captures.length > 0)
			{
				res.status(400).json({
					success: false,
					errors: [
						{ key: 'flag', message: 'You have already solved this challenge.' }
					]
				});
				return;
			}

			/* Posting the capture to the database.
			 */
			await client.capture.create({
				data: {
					teamId: user.teamId,
					challengeId: parseInt(req.params['id']),
				}
			}).then(() =>
			{
				res.status(200).json({
					success: true,
				});
			});
		});
	}
	else
	{
		res.status(400).json({
			success: false,
			errors: [
				{ key: 'flag', message: 'Incorrect flag.' }
			]
		});
	}
}
