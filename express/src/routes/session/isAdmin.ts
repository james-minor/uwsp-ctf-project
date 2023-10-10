import { Request, Response } from 'express';
import Server from '../../Server';
import { APIResponse } from '../../interfaces/APIResponse';
import Session from '../../auth/Session';

module.exports = function (path: string, server: Server)
{
	server.router.get(path, async (req: Request, res: Response<APIResponse>) =>
	{
		let sessionToken: string | undefined = req.headers['authorization'];
		if (!sessionToken)
		{
			res.status(400).json({
				success: false,
				errors: [
					{ key: 'error', message: 'Please provide a bearer token.' }
				],
			});

			return;
		}
		else
		{
			res.status(200).json({
				success: true,
				data: {
					authorized: await Session.validate(sessionToken, true),
				}
			});
		}
	});
}