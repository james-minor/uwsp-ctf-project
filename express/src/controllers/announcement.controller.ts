import { Request, Response } from 'express';
import { APIResponse } from '../interfaces/APIResponse';
import client from '../Client';

export async function getAll(req: Request, res: Response<APIResponse>)
{
	const announcements = await client.announcement.findMany({
		select: {
			id: true,
			body: true,
			creationDate: true,
			author: {
				select: {
					id: true,
					username: true,
				},
			},
		},
	});

	res.status(200).json({
		success: true,
		data: {
			announcements: announcements
		}
	});
}

export async function get(req: Request, res: Response<APIResponse>)
{
	await client.announcement.findUnique({
		where: {
			id: parseInt(req.params['id']),
		},
	}).then((announcement) =>
	{
		if (announcement)
		{
			res.status(200).json({
				success: true,
				data: {
					announcement
				},
			});
		}
		else
		{
			res.status(404).json({
				success: false,
				errors: [
					{ key: 'error', message: `No announcement with ID: ${req.params['id']}` },
				],
			});
		}
	});
}

export async function create(req: Request, res: Response<APIResponse>)
{
	if (!req.headers.authorization)
	{
		res.status(400).json({
			success: false,
		});
		return;
	}

	const authorId: number | undefined = await client.session.findUnique({
		where: {
			key: req.headers.authorization.split(' ')[1],
		},
		select: {
			user: {
				select: {
					id: true,
				}
			}
		}
	}).then((result) =>
	{
		if (result)
		{
			return result['user']['id'];
		}

		return undefined;
	});

	if (authorId)
	{
		await client.announcement.create({
			data: {
				authorId: authorId,
				body: req.body['body'],
			}
		}).then(() =>
		{
			res.status(200).json({
				success: true,
			});
		});
	}
	else
	{
		res.status(400).json({
			success: false,
		});
	}

}

export async function update(req: Request, res: Response<APIResponse>)
{
	console.log(req);

	await client.announcement.update({
		where: {
			id: parseInt(req.params['id']),
		},
		data: {
			body: req.body['body']
		}
	}).then((result) =>
	{
		if (result)
		{
			res.status(200).json({
				success: true,
			});
			return;
		}

		res.status(400).json({
			success: false,
		});
	});
}

export async function remove(req: Request, res: Response<APIResponse>)
{
	try
	{
		await client.announcement.delete({
			where: {
				id: parseInt(req.params['id']),
			},
		}).then(() =>
		{
			res.status(200).json({
				success: true,
			});
		});
	}
	catch (e)
	{
		res.status(404).json({
			success: false,
		});
	}
}