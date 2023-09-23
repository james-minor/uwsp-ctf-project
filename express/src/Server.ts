import express, { Express, NextFunction, Request, Response, Router } from 'express';
import ILogger from './logging/ILogger';
import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';

export default class Server
{
	/**
	 * Express application that is created on Server construction.
	 */
	public app: Express;

	/**
	 * The Express Router that is used to handle API requests.
	 */
	public router: Router;

	/**
	 * The passed Prisma ORM client.
	 */
	public prisma: PrismaClient;

	/**
	 * The passed logging handler.
	 */
	public logger: ILogger;

	/**
	 * The port that the Express app will listen on.
	 */
	public port: number;

	/**
	 * The current development environment.
	 */
	public environment: 'development' | 'production';

	/**
	 * Constructor for the Server class.
	 *
	 * @param prisma A passed PrismaClient, will be passed to Routes to allow for interacting with a database.
	 * @param logger A passed logging manager that extends the ILogger interface.
	 * @param port The port that the Server will listen on.
	 * @param environment The current development environment.
	 */
	constructor(
		prisma: PrismaClient,
		logger: ILogger,
		port: number = 8000,
		environment?: 'development' | 'production'
	)
	{
		this.prisma = prisma;
		this.logger = logger;

		this.app = express();
		this.router = express.Router();
		this.port = port;

		this.environment = environment === undefined ? 'production' : environment;
	}

	/**
	 * Starts the Express application, setting up any middlewares, and linking any routes in the /routes directory.
	 */
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