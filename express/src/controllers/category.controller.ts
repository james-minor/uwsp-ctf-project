import { Request, Response } from 'express';
import { APIResponse } from '../interfaces/APIResponse';
import client from '../Client';

export async function getAll(req: Request, res: Response<APIResponse>)
{
	await client.category.findMany({})
		.then((categories) =>
		{
			res.status(200).json({
				success: true,
				data: {
					categories: categories,
				}
			});
		})
}

export async function create(req: Request, res: Response<APIResponse>)
{
	try
	{
		await client.category.create({
			data: {
				title: req.body['title']
			}
		})
			.then(() =>
			{
				res.status(200).json({
					success: true,
				});
			});
	}
	catch (e)
	{
		res.status(400).json({
			success: false,
		});
	}
}

export async function update(req: Request, res: Response<APIResponse>)
{
	try
	{
		await client.category.update({
			where: {
				id: parseInt(req.params['id']),
			},
			data: {
				title: req.body['title'],
			}
		})
			.then((result) =>
			{
				res.status(200).json({
					success: true,
				});
			});
	}
	catch (e)
	{
		res.status(400).json({
			success: false,
		});
	}
}

/**
 * Removes a category, with a requested ID, from the database.
 *
 * @param req
 * @param res
 */
export async function remove(req: Request, res: Response<APIResponse>)
{
	try
	{
		await client.category.delete({
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
		res.status(400).json({
			success: false,
		});
	}
}