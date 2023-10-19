import { Request, Response } from 'express';
import { APIResponse } from '../interfaces/APIResponse';
import client from '../Client';

export async function getAll(req: Request, res: Response<APIResponse>)
{
	const announcements = await client.announcement.findMany({});

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

export function create(req: Request, res: Response<APIResponse>)
{

}

export function update(req: Request, res: Response<APIResponse>)
{

}

export function remove(req: Request, res: Response<APIResponse>)
{

}