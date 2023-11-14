import { Request, Response } from 'express';
import { APIResponse } from '../interfaces/APIResponse';
import client from '../Client';

/**
 * Returns an array of all challenge captures.
 *
 * @param req The HTTP request.
 * @param res The HTTP response, implements the APIResponse interface.
 */
export async function getAll(req: Request, res: Response<APIResponse>)
{
	await client.capture.findMany({
		select: {
			teamId: true,
			solveDate: true,
			team: {
				select: {
					name: true,
				}
			},
			challenge: {
				select: {
					value: true,
				}
			}
		}
	})
		.then((captures) =>
		{
			res.status(200).json({
				success: true,
				data: {
					captures: captures,
				}
			});
		});
}