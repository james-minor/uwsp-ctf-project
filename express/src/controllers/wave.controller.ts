import { Request, Response } from 'express';
import { APIResponse } from '../interfaces/APIResponse';

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
	res.status(200).json({
		success: false,
		data: {
			'controller method': 'getAll'
		}
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
	res.status(200).json({
		success: false,
		data: {
			'controller method': 'update'
		}
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

