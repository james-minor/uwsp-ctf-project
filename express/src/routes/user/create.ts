import { Request, Response } from 'express';
import Server from '../../Server';
import { APIResponse } from '../../interfaces/APIResponse';
import { Role } from '@prisma/client';
import prisma from '../../Client';
import Password from '../../auth/Password';
import Session from '../../auth/Session';

module.exports = function (path: string, server: Server)
{
	server.router.post(path, async (req: Request, res: Response<APIResponse>) =>
	{
		const request = req.body;

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
		if (request.email.length > 75)
		{
			errors.email = 'Email address cannot be more than 75 characters.';
		}

		/* Thanks to https://stackoverflow.com/a/201378
		 */
		let emailRegex = new RegExp('(?:[a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\\])');
		if (!emailRegex.test(request.email))
		{
			errors.email = 'Please provide a valid email address.';
		}

		/* Seeing if email is already taken.
		 */
		await prisma.user.count({
			where: {
				email: request.email
			}
		}).then((count) =>
		{
			if (count > 0)
			{
				errors.email = 'Email is already taken.';
			}
		});


		/* Validating username.
		 */
		if (!request.username)
		{
			errors.username = 'Please provide a username.';
		}

		if (request.username.length < 3)
		{
			errors.username = 'Username must be at least 3 characters.';
		}

		if (request.username.length > 30)
		{
			errors.username = 'Username cannot be more than 30 characters.';
		}

		/* Seeing if username is already taken.
		 */
		await prisma.user.count({
			where: {
				username: request.username
			}
		}).then((count) =>
		{
			if (count > 0)
			{
				errors.username = 'Username already taken.';
			}
		});

		/* Validating password.
		 */
		if (request.password.length < 10)
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
		let passwordHash = await Password.create(request.password);
		if (!passwordHash)
		{
			res.status(500);
			return;
		}

		/* Creating the user in the database. If there is no user in the database, the newly created user
		 * will be created as an ADMIN.
		 */
		await prisma.user.count({
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

			await prisma.user.create({
				data: {
					role: userRole,
					email: request.email,
					username: request.username,
					passwordHash: await Password.create(request.password)
				}
			}).then(async (user) =>
			{
				let sessionKey = Session.create();

				await prisma.session.create({
					data: {
						key: sessionKey,
						userId: user.id,
					}
				});

				res.status(200).json({
					success: true,
					data: {
						message: `${sessionKey}`
					}
				});
			});
		})
	});
}