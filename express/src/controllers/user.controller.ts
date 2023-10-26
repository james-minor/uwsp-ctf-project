import { NextFunction, Request, Response } from 'express';
import { APIResponse } from '../interfaces/APIResponse';
import client from '../Client';
import { Role } from '@prisma/client';
import { generatePasswordHash } from '../auth/password';
import { emailTaken, validEmail, validEmailLength } from '../utils/email';
import { usernameTaken, validUsernameLength } from '../utils/username';

/**
 * Allows a non-authenticated client to create a user account. If no admin user accounts exist when the
 * user is registered, the resulting user will be given admin privileges.
 *
 * @param req The HTTP request.
 * @param res The HTTP response, implements the APIResponse interface.
 * @param next The next middleware function to call.
 */
export async function register(req: Request, res: Response<APIResponse>, next: NextFunction)
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
		}).then(() =>
		{
			next();
		});
	});
}

/**
 * Allows for a logged-in user to update their account password.
 *
 * @param req The HTTP request.
 * @param res The HTTP response, implements the APIResponse interface.
 */
export async function updatePassword(req: Request, res: Response<APIResponse>)
{
	res.status(200).json({
		success: false,
		data: {
			'controller method': 'updatePassword'
		}
	});
}

/**
 * Allows for an administrator to update a user account's role.
 *
 * @param req The HTTP request.
 * @param res The HTTP response, implements the APIResponse interface.
 */
export async function updateRole(req: Request, res: Response<APIResponse>)
{
	/* Validating the role body parameter.
	 */
	if (req.body['role'] !== 'ADMIN' && req.body['role'] !== 'USER')
	{
		res.status(400).json({
			success: false,
		});
		return;
	}

	await client.user.update({
		where: {
			id: parseInt(req.params['id']),
		},
		data: {
			role: req.body['role'],
		}
	}).then(() =>
	{
		res.status(200).json({
			success: true,
		});
	}).catch(() =>
	{
		res.status(500).json({
			success: false,
		});
	});
}

/**
 * Allows for a user to delete their own account.
 *
 * @param req The HTTP request.
 * @param res The HTTP response, implements the APIResponse interface.
 */
export async function remove(req: Request, res: Response<APIResponse>)
{
	res.status(200).json({
		success: false,
		data: {
			'controller method': 'remove'
		}
	});
}

/**
 * Used by an administrator to kick a specific user from the competition.
 *
 * @param req The HTTP request.
 * @param res The HTTP response, implements the APIResponse interface.
 */
export async function kick(req: Request, res: Response<APIResponse>)
{
	await client.user.delete({
		where: {
			id: parseInt(req.params['id']),
		}
	}).then(() =>
	{
		res.status(200).json({
			success: true,
		});
	}).catch(() =>
	{
		res.status(404).json({
			success: false,
		});
	});
}

/**
 * Returns private user data for a logged-in user.
 *
 * @param req The HTTP request.
 * @param res The HTTP response, implements the APIResponse interface
 */
export async function getPrivateUserData(req: Request, res: Response<APIResponse>)
{
	await client.user.findUnique({
		where: {
			id: parseInt(req.params['id'])
		}
	}).then((user) =>
	{
		if (user)
		{
			res.status(200).json({
				success: true,
				data: {
					email: user.email,
					username: user.username,
					teamId: user.teamId,
				}
			});
		}

		res.status(500);
	});
}

/**
 * Returns public user data from a passed user ID, for example the user's username.
 *
 * @param req The HTTP request.
 * @param res The HTTP response, implements the APIResponse interface.
 */
export async function getPublicUserData(req: Request, res: Response<APIResponse>)
{
	await client.user.findUnique({
		where: {
			id: parseInt(req.params['id'])
		}
	}).then((user) =>
	{
		if (user)
		{
			res.status(200).json({
				success: true,
				data: {
					username: user.username,
				}
			});
		}
		else
		{
			res.status(200).json({
				success: false,
				errors: [
					{ key: 'error', message: `No username with ID: ${req.params['id']}` },
				],
			});
		}
	});
}

export async function getAll(req: Request, res: Response<APIResponse>)
{
	await client.user.findMany({
		select: {
			id: true,
			username: true,
			role: true,
		}
	}).then((users) =>
	{
		res.status(200).json({
			success: true,
			data: {
				users: users,
			}
		});
	});
}