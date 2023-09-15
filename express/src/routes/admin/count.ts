import { Request, Response } from 'express';
import Server from '../../Server';

module.exports = function(path: string, server: Server)
{
	server.router.get(path, (req: Request, res: Response) =>
	{
		server.pool.query(`SELECT COUNT(*) FROM user_accounts WHERE role='ADMIN'`).then(result =>
		{
			res.status(200).json({
				count: parseInt(result.rows[0].count)
			});
		});
	});
}