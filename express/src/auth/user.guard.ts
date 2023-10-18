import { Request, Response, NextFunction } from 'express';
import { APIResponse } from '../interfaces/APIResponse';
import validateSession from './session';

/**
 * Middleware that prevents a route from being accessed unless the request Authorization header
 * contains a valid, non-expired session token for a user.
 *
 * @param req The Express Request object.
 * @param res The Express Response object.
 * @param next The next middleware function to be called.
 */
export default async function userGuard(req: Request, res: Response<APIResponse>, next: NextFunction)
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
	if (!(await validateSession(sessionToken, false)))
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