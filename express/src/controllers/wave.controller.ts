import { Request, Response } from 'express';
import { APIResponse } from '../interfaces/APIResponse';
import client from '../Client';

export async function get(req: Request, res: Response<APIResponse>)
{
	res.status(200).json({
		success: false,
		data: {
			'controller method': 'get'
		}
	});
}

export async function getAll(req: Request, res: Response<APIResponse>)
{
	await client.wave.findMany({})
		.then((waves) =>
		{
			res.status(200).json({
				success: true,
				data: {
					waves: waves
				}
			});
		});
}


export async function create(req: Request, res: Response<APIResponse>)
{
	res.status(200).json({
		success: false,
		data: {
			'controller method': 'create'
		}
	});
}

export async function update(req: Request, res: Response<APIResponse>)
{
	await client.wave.update({
		where: {
			id: parseInt(req.params['id']),
		},
		data: {
			releaseDate: req.body['releaseDate'],
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
		});
}

export async function remove(req: Request, res: Response<APIResponse>)
{
	res.status(200).json({
		success: false,
		data: {
			'controller method': 'remove'
		}
	});
}

