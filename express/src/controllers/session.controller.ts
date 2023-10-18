import { Request, Response } from 'express';
import { APIResponse } from '../interfaces/APIResponse';
import client from '../Client';
import bcrypt from 'bcryptjs';
import { generateSession } from '../auth/session';

export async function login(req: Request, res: Response<APIResponse>)
{
	let errors: {
		email: string | undefined,
		password: string | undefined,
	} = {
		email: undefined,
		password: undefined,
	};

	const loginApproved = await client.user.findUnique({
		where: {
			email: req.body.email
		}
	})
		.then(async (user) =>
		{
			if (!user)
			{
				return false;
			}

			return await bcrypt.compare(req.body.password, user.passwordHash);
		});

	if (loginApproved)
	{
		let sessionKey = generateSession();

		res.status(200).json({
			success: true,
			data: {
				'session': sessionKey
			}
		});
	}
	else
	{
		res.status(200).json({
			success: false,
		});
	}
}

export async function logout(req: Request, res: Response<APIResponse>)
{
	res.status(200).json({
		success: false,
		data: {
			'controller method': 'logout'
		}
	});
}
