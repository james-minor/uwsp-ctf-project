import { Request, Response } from 'express';
import { APIResponse } from '../interfaces/APIResponse';
import client from '../Client';

/**
 * Returns a list of posted announcements, sorted by creationDate, including relevant author information.
 *
 * @param req The HTTP request.
 * @param res The HTTP response, implements the APIResponse interface.
 */
export async function getAll(req: Request, res: Response<APIResponse>)
{
	await client.announcement.findMany({
		orderBy: [
			{
				creationDate: 'desc'
			},
			{}  // This is required to be here or everything breaks, don't ask why.
		],
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
	}).then((announcements) =>
	{
		res.status(200).json({
			success: true,
			data: {
				announcements: announcements
			}
		});
	});
}

/**
 * Unlike most other routes, the poll controller sends a server-side event response. This creates a text stream that
 * sends a new response any time the amount of announcements changes. It's important to note that a message will NOT
 * be sent if an announcement is simply updated.
 *
 * @param req The HTTP request.
 * @param res The HTTP response, implements the APIResponse interface.
 */
export async function poll(req: Request, res:Response)
{
	/* Setting and sending the headers for Server-Sent Events.
	 */
	res.set({
		'Access-Control-Allow-Origin': '*',
		'Cache-Control': 'no-cache',
		'Content-Type': 'text/event-stream',
		'Connection': 'keep-alive',
		'X-Accel-Buffering': 'no',
	});

	/* How often should the client attempt to reconnect? In milliseconds.
	 */
	const attemptReconnectInterval: number = 10000
	res.write(`retry: ${attemptReconnectInterval}\n\n`);

	let connectionOpen: boolean = true;			// Is the client connection currently open?
	let numberOfAnnouncements: number = 0;		// Number of announcements in the last sent data packet.

	/* Polling for new announcements.
	 */
	while (connectionOpen)
	{
		await new Promise(resolve => setTimeout(resolve, 3000));

		await client.announcement.findMany({
			orderBy: [
				{
					creationDate: 'desc'
				},
				{}  // This is required to be here or everything breaks, don't ask why.
			],
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
		}).then((announcements) =>
		{
			/* We only send back a response if there is a different number of announcements since our last response.
			 */
			if (announcements.length !== numberOfAnnouncements)
			{
				numberOfAnnouncements = announcements.length;
				res.write('event: message\n');
				res.write(`data: ${JSON.stringify(announcements)}\n\n`);
			}
		});
	}

	/* We stop polling if the connection closes.
	 */
	req.on('close', () =>
	{
		connectionOpen = false;
	});
}

/**
 * Attempts to post a new announcement.
 *
 * @param req The HTTP request.
 * @param res The HTTP response, implements the APIResponse interface.
 */
export async function create(req: Request, res: Response<APIResponse>)
{
	/* Since this method is covered by our admin route guard, this should always be true; so this check is mostly
	 * to satisfy typescript from thinking that req.headers will be undefined, and to act as a secondary safeguard.
	 */
	if (!req.headers.authorization)
	{
		res.status(400).json({
			success: false,
		});
		return;
	}

	/* Gathering the author ID.
	 */
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

	/* Posting the announcement.
	 */
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

/**
 * Attempts to update an existing announcement.
 *
 * @param req The HTTP request.
 * @param res The HTTP response, implements the APIResponse interface.
 */
export async function update(req: Request, res: Response<APIResponse>)
{
	await client.announcement.update({
		where: {
			id: parseInt(req.params['id']),
		},
		data: {
			body: req.body['body']
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

/**
 * Attempts to delete an existing announcement.
 *
 * @param req The HTTP request.
 * @param res The HTTP response, implements the APIResponse interface.
 */
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