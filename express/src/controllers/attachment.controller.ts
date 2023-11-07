import { Request, Response } from 'express';
import { APIResponse } from '../interfaces/APIResponse';
import client from '../Client';
import { Wave } from '@prisma/client';
import fs from 'fs';
import validateSession from '../auth/session';

/**
 * Returns an array of all attachments, regardless of if the attachment has been released or not.
 *
 * @param req The HTTP request.
 * @param res The HTTP response, implements the APIResponse interface.
 */
export async function getAll(req: Request, res: Response<APIResponse>)
{
	await client.attachment.findMany({})
		.then((attachments) =>
		{
			res.status(200).json({
				success: true,
				data: {
					attachments: attachments,
				}
			});
		});
}

/**
 * Returns an attachment file, if the attachment's challenge has been released. Otherwise, returns a 404 error.
 *
 * If passed a 'session' query parameter, will check if that is a valid admin session token. If so, will return the
 * attachment file, even if the attachment's challenge has not been released.
 *
 * @param req The HTTP request.
 * @param res The HTTP response.
 */
export async function get(req: Request, res: Response)
{
	/* Sending the attachment for users with ADMIN role.
	 */
	if (await validateSession(String(req.query['session']), true))
	{
		await client.attachment.findUnique({
			where: {
				id: parseInt(req.params['id']),
			}
		}).then((attachment) =>
		{
			if (attachment)
			{
				res.status(200).sendFile(attachment.source);
			}
			else
			{
				res.status(404).json({
					success: false,
				});
			}
		}).catch(() =>
		{
			res.status(500).json({
				success: false,
			});
		});

		return;
	}

	/* Sending the attachment to normal users, if the attachment should be viewable.
	 */
	await client.attachment.findUnique({
		include: {
			challenge: {
				include: {
					wave: true,
				}
			}
		},
		where: {
			id: parseInt(req.params['id']),
		}
	}).then((attachment) =>
	{
		if (attachment && attachment['challengeId'] && attachment['challenge']['waveId'])
		{
			const wave = attachment['challenge']['wave'] as Wave;

			if (new Date(wave.releaseDate) < new Date())
			{
				res.status(200).sendFile(attachment.source);
				return;
			}
		}

		res.status(404).json({
			success: false,
		});
	}).catch(() =>
	{
		res.status(500).json({
			success: false,
		});
	});
}

/**
 * Creates a new attachment entry in the database, along with saving the file sent in the request.
 *
 * @param req The HTTP request.
 * @param res The HTTP response, implements the APIResponse interface.
 */
export async function create(req: Request, res: Response<APIResponse>)
{
	if (!req.file)
	{
		res.status(400).json({
			success: false,
		});
		return;
	}

	await client.attachment.create({
		data: {
			title: req.body['title'],
			source: req.file.path,
			challengeId: parseInt(req.body['challengeId']),
		}
	}).then(() =>
	{
		res.status(200).json({
			success: true,
		});
	}).catch(() =>
	{
		if (req.file)
		{
			fs.unlinkSync(req.file.path);
		}

		res.status(500).json({
			success: false,
		});
	})


}

/**
 * Updates an existing attachment entry in the database.
 *
 * @param req The HTTP request.
 * @param res The HTTP response, implements the APIResponse interface.
 */
export async function update(req: Request, res: Response<APIResponse>)
{
	client.attachment.update({
		where: {
			id: parseInt(req.params['id']),
		},
		data: {
			title: req.body['title'],
			challengeId: parseInt(req.body['challengeId']),
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
 * Deletes an existing attachment, and it's associated file.
 *
 * @param req The HTTP request.
 * @param res The HTTP response, implements the APIResponse interface.
 */
export async function remove(req: Request, res: Response<APIResponse>)
{
	/* Deleting the associated file connected to the attachment.
	 */
	client.attachment.findUnique({
		where: {
			id: parseInt(req.params['id']),
		},
	}).then((attachment) =>
	{
		if (attachment)
		{
			fs.unlinkSync(attachment.source);
		}
	});

	/* Deleting the attachment entry in the database.
	 */
	client.attachment.delete({
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