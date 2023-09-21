import express, { Express, NextFunction, Request, Response, Router } from 'express';
import ILogger from './logging/ILogger';
import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';

export default class Server
{
	public app: Express;
	public router: Router;

	public client: PrismaClient;
	public logger: ILogger;

	public port: number;
	public environment: 'development' | 'production';

	constructor(
		client: PrismaClient,
		logger: ILogger,
		port: number = 8000,
		environment?: 'development' | 'production'
	)
	{
		this.client = client;
		this.logger = logger;

		this.app = express();
		this.router = express.Router();
		this.port = port;

		this.environment = environment === undefined ? 'production' : environment;
	}

	public start()
	{
		this.setupMiddleware();
		this.linkRoutes();

		this.app.listen(this.port, () =>
		{
			this.logger.info(`Express API listening on port ${this.port}...`);
		});
	}

	protected setupMiddleware()
	{
		/* Setting up the logging middleware to log all API requests.
		 */
		this.app.use((req: Request, res: Response, next: NextFunction) =>
		{
			this.logger.info(`${req.method} ${req.url} ${req.protocol.toUpperCase()}/${req.httpVersion}`);
			next();
		});

		/* Application-level middleware that will prevent API access unless the remote host is our Astro service
		 * container. (Note: this only happens in PRODUCTION mode, in DEVELOPMENT mode any remote host can access
		 * the API).
		 */
		if (this.environment === 'production')
		{
			this.app.use((req: Request, res: Response, next: NextFunction) =>
			{
				if (req.ip === 'https://astro:4321' || req.ip === 'http://astro:4321')
				{
					next();
				}

				res.status(403).json({error: 'Attempted access from invalid remote host.'});
			});
		}

		/* Prefixing '/api/v1/' to all internal routing.
		 */
		this.app.use('/api/v1/', this.router);
	}

	protected linkRoutes()
	{
		/* Recursively getting the routes from the 'routes' directory. We add all the route files at run-time, allowing
		 * for the file system to define the route path.
		 */
		let routes = fs.readdirSync(path.join(__dirname, 'routes'), { recursive: true });
		routes.forEach(route =>
		{
			if (typeof route === 'string' && route.includes('.js'))
			{
				let endpoint = '/' + route.replace('.js', '');

				require('./routes' + endpoint)(endpoint, this);
			}
		});
	}
}