import { Request, Response } from 'express';
import { Role } from '@prisma/client';

import Server from '../../Server';

module.exports = function(path: string, server: Server)
{
	server.router.get(path, async (req: Request, res: Response) =>
	{
		const result = await server.client.user.count({
			where: {
				role: Role.ADMIN
			}
		});

		res.status(200).json({
			count: result
		});
	});
}