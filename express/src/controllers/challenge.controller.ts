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
		await client.challenge.findMany({
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
		})
			.then(async (challenges) =>
			{
				res.status(200).json({
					success: true,
					data: {
						challenges: challenges
					}
				});
			});
	}
}

// TODO: documentation.
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

// TODO: documentation.
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

// TODO: documentation.
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
	// TODO: implement.
}
