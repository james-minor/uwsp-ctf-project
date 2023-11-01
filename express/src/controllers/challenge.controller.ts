import { Request, Response } from 'express';
import { APIResponse } from '../interfaces/APIResponse';
import client from '../Client';

/**
 * Returns a list of every challenge, hiding data for any challenge that has not released yet.
 *
 * @param req The HTTP request.
 * @param res The HTTP response, implements the APIResponse interface.
 */
export async function getReleased(req: Request, res: Response<APIResponse>)
{
	const currentDate = new Date().toISOString();
	console.log(currentDate);

	await client.challenge.findMany({
		include: {
			category: true,
			wave: true,
		},
		where: {
			categoryId: {
				not: null,
			},
			wave: {
				releaseDate: {
					lte: currentDate
				}
			}
		}
	})
		.then((challenges) =>
		{
			console.log('\n\n\n\n');
			// TODO: we should only show category, value, and release date of challenge, if it is unreleased.
			for (let challenge of challenges)
			{
				if (challenge['category'])
				{
					console.log(challenge['category'].title);
				}
				console.log(challenge);
				console.log(challenge.waveId);
			}

			let releasedChallenges: any[] = [];
			// TODO: check with Chad, should unreleased challenges show or hide the title of the challenge?

			res.status(200).json({
				success: true,
				data: {
					challenges: releasedChallenges
				}
			});
		});
}

/**
 * Returns a list of every challenge, with all of its data, regardless if the challenge has been released or not. Used
 * for admin-only views.
 *
 * @param req The HTTP request.
 * @param res The HTTP response, implements the APIResponse interface.
 */
export async function getAll(req: Request, res: Response<APIResponse>)
{
	await client.challenge.findMany({
		orderBy: [
			{
				id: 'asc',
			},
			{}
		],
		include: {
			category: true,
			wave: true,
		}
	})
		.then((challenges) =>
		{
			res.status(200).json({
				success: true,
				data: {
					challenges: challenges
				}
			});
		});
}

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

export async function update(req: Request, res: Response<APIResponse>)
{
	console.log(req.body);

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
	}).then((result) =>
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

}
