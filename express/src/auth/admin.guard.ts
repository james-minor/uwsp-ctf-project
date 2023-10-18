import { Request, Response, NextFunction } from 'express';
import { APIResponse } from '../interfaces/APIResponse';
import validateSession from './validateSession';

export default async function adminGuard(req: Request, res: Response<APIResponse>, next: NextFunction)
{
	/* Validating that the authorization header was passed in the Request.
	 */
	if (!req.headers.authorization)
	{
		res.status(400).json({
			success: false,
			errors: [
				{ key: 'error', message: 'No authorization token provided.' },
			],
		});
		return;
	}

	const sessionToken = req.headers.authorization.split(' ')[1];

	/* Validating the session token.
	 */
	if (!(await validateSession(sessionToken, true)))
	{
		res.status(403).json({
			success: false,
			errors: [
				{ key: 'error', message: 'Could not validate session.' },
			],
		});
		return;
	}

	next();
}