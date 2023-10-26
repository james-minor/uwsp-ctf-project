import { Request, Response, NextFunction } from 'express';
import { APIResponse } from '../interfaces/APIResponse';
import validateSession from './session';

/**
 * Middleware that prevents a route from being accessed unless the request Authorization header
 * contains a valid, non-expired session token for a user with elevated privileges.
 *
 * @param req The Express Request object.
 * @param res The Express Response object.
 * @param next The next middleware function to be called.
 */
export async function adminGuard(req: Request, res: Response<APIResponse>, next: NextFunction)
{
	/* If we don't have this or statement, compiler complains that req.headers.authorization could be undefined,
	 * even though we already validate it exists within validateAuthorizationHeader().
	 */
	if (!validateAuthorizationHeader(req, res) || !req.headers.authorization)
	{
		return;
	}

	/* Validating the session token.
	 */
	const sessionToken = req.headers.authorization.split(' ')[1];
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

/**
 * Middleware that prevents a route from being accessed unless the request Authorization header
 * contains a valid, non-expired session token for a user.
 *
 * @param req The Express Request object.
 * @param res The Express Response object.
 * @param next The next middleware function to be called.
 */
export async function userGuard(req: Request, res: Response<APIResponse>, next: NextFunction)
{
	/* If we don't have this or statement, compiler complains that req.headers.authorization could be undefined,
	 * even though we already validate it exists within validateAuthorizationHeader().
	 */
	if (!validateAuthorizationHeader(req, res) || !req.headers.authorization)
	{
		return;
	}

	/* Validating the session token.
	 */
	const sessionToken = req.headers.authorization.split(' ')[1];
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

/* Validates that the authorization header exists, and has the correct format.
 */
function validateAuthorizationHeader(req: Request, res: Response<APIResponse>): boolean
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
		return false;
	}

	/* Testing if the authorization header is in the proper format.
	 */
	if (!new RegExp('^Bearer [A-Za-z0-9]{48}$').test(req.headers.authorization))
	{
		res.status(400).json({
			success: false,
			errors: [
				{ key: 'error', message: 'Malformed authorization header.' },
			],
		});
		return false;
	}

	return true;
}