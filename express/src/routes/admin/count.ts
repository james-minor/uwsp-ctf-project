import { Request, Response } from 'express';
import { Role } from '@prisma/client';

import Server from '../../Server';
import { APIResponse } from '../../interfaces/APIResponse';

module.exports = function(path: string, server: Server)
{
	server.router.get(path, async (req: Request, res: Response<APIResponse>) =>
	{
		const result = await server.prisma.user.count({
			where: {
				role: Role.ADMIN
			}
		});

		res.status(200).json({
			success: true,
			data: {
				count: result
			}
		});
	});
}