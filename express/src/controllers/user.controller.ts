import { Request, Response } from 'express';
import { APIResponse } from '../interfaces/APIResponse';
import client from '../Client';
import { Role } from '@prisma/client';
import { generatePasswordHash } from '../auth/password';
import { emailTaken, validEmail, validEmailLength } from '../utils/email';
import { usernameTaken, validUsernameLength } from '../utils/username';
import { login } from './session.controller';

export async function register(req: Request, res: Response<APIResponse>)
{
	let errors: {
		email: string | undefined,
		username: string | undefined,
		password: string | undefined,
	} = {
		email: undefined,
		username: undefined,
		password: undefined,
	};

	/* Validating email.
	 */
	if (!validEmailLength(req.body.email))
	{
		errors.email = 'Email address cannot be more than 75 characters.';
	}

	if (!validEmail(req.body.email))
	{
		errors.email = 'Please provide a valid email address.';
	}

	if (await emailTaken(req.body.email))
	{
		errors.email = 'Email is already taken.';
	}

	/* Validating username.
	 */
	if (!req.body.username)
	{
		errors.username = 'Please provide a username.';
	}

	if (!validUsernameLength(req.body.username))
	{
		errors.username = 'Username must be between 3-30 characters.';
	}

	if (await usernameTaken(req.body.username))
	{
		errors.username = 'Username already taken.';
	}

	/* Validating password.
	 */
	if (req.body.password.length < 10)
	{
		errors.password = 'Password must be at least 10 characters.';
	}

	/* Sending back errors, if any.
	 */
	if (errors.username || errors.password || errors.email)
	{
		res.status(400).json({
			success: false,
			errors: [
				{
					key: 'email',
					message: errors.email ? errors.email : ''
				},
				{
					key: 'username',
					message: errors.username ? errors.username : ''
				},
				{
					key: 'password',
					message: errors.password ? errors.password : ''
				}
			]
		});

		return;
	}

	/* Hashing the password and creating the user entry in the database.
	 */
	let passwordHash = await generatePasswordHash(req.body.password);
	if (!passwordHash)
	{
		res.status(500);
		return;
	}

	/* Creating the user in the database. If there is no user in the database, the newly created user
	 * will be created as an ADMIN.
	 */
	return await client.user.count({
		where: {
			role: Role.ADMIN as Role
		}
	}).then(async (count) =>
	{
		let userRole: Role = Role.USER;
		if (count === 0)
		{
			userRole = Role.ADMIN;
		}

		await client.user.create({
			data: {
				role: userRole,
				email: req.body.email,
				username: req.body.username,
				passwordHash: passwordHash
			}
		}).then(async () =>
		{
			return await login(req, res);
		});
	});
}

export async function updateInfo(req: Request, res: Response<APIResponse>)
{
	res.status(200).json({
		success: false,
		data: {
			'controller method': 'updateInfo'
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

export async function kick(req: Request, res: Response<APIResponse>)
{
	res.status(200).json({
		success: false,
		data: {
			'controller method': 'kick'
		}
	});
}