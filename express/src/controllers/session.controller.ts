import { Request, Response } from 'express';
import { APIResponse } from '../interfaces/APIResponse';
import client from '../Client';
import bcrypt from 'bcryptjs';
import { generateSession } from '../auth/session';

/**
 * Handles logging in and creating a user session. When passed valid email and password authentication fields,
 * will delete any existing sessions for the logged-in user, and then generate a new session for the user.
 * The new session token is then sent in the HTTP response.
 *
 * @param req The HTTP request.
 * @param res The HTTP response, implements the APIResponse interface.
 */
export async function login(req: Request, res: Response<APIResponse>)
{
	let errors: {
		email: string | undefined,
		password: string | undefined,
	} = {
		email: undefined,
		password: undefined,
	};

	await client.user.findUnique({
		where: {
			email: req.body.email
		}
	}).then(async (user): Promise<{ id: undefined | number, auth: boolean }> =>
	{
		if (!user)
		{
			errors.email = 'That user does not exist.';
			return { id: undefined, auth: false }
		}

		return { id: user.id, auth: await bcrypt.compare(req.body.password, user.passwordHash) };
	}).then(async ({ id, auth }) =>
	{
		/* Sending error if the userId or password could not be validated.
		 */
		if (!(id && auth))
		{
			errors.password = 'Incorrect password.'
			res.status(400).json({
				success: false,
				errors: [
					{
						key: 'email',
						message: errors.email ? errors.email : ''
					},
					{
						key: 'password',
						message: errors.password ? errors.password : ''
					}
				]
			});
			return;
		}

		let sessionKey = generateSession();

		/* Deleting any existing client sessions, to maintain the unique constraint on session userIds
		 */
		await client.session.delete({
			where: {
				userId: id
			}
		}).catch(() =>
		{
			/* Delete will throw an exception if the client does not currently have a session in the database.
			 * Catching here to prevent this from crashing the API.
			 */
		});

		/* Creating the new client session.
		 */
		await client.session.create({
			data: {
				userId: id,
				key: sessionKey,
			}
		});

		/* Sending the success response.
		 */
		res.status(200).json({
			success: true,
			data: {
				'session': sessionKey
			}
		});
	});
}

/**
 * Handles logging out a user session. When passed a valid session token in the authorization header,
 * the logout function will delete that user's session from the sessions database table.
 *
 * @param req The HTTP request.
 * @param res The HTTP response, implements the APIResponse interface.
 */
export async function logout(req: Request, res: Response<APIResponse>)
{
	/* Validating the DELETE request.
	 */
	if (!req.headers.authorization)
	{
		res.status(400).json({
			success: false,
			errors: [
				{ key: 'error', message: 'No session token provided.' }
			]
		});
		return;
	}

	/* Attempting to delete the client session from the database.
	 */
	try
	{
		await client.session.delete({
			where: {
				key: req.headers.authorization.split(' ')[1]
			},
		});
	}
	catch (e)
	{
		res.status(400).json({
			success: false,
			errors: [
				{ key: 'error', message: 'Could not delete the user session.' },
			]
		});
		return;
	}

	/* Sending the success response.
	 */
	res.status(200).json({
		success: true
	});
}
