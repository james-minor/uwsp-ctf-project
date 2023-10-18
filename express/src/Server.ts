import express, { Express, NextFunction, Request, Response, Router } from 'express';
import ILogger from './logging/ILogger';
import fs from 'fs';
import path from 'path';
import helmet from 'helmet';

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
	 * The passed logging handler.
	 */
	public logger: ILogger;

	/**
	 * The port that the Express app will listen on.
	 */
	public port: number;

	/**
	 * Constructor for the Server class.
	 *
	 * @param logger A passed logging manager that extends the ILogger interface.
	 * @param port The port that the Server will listen on.
	 */
	constructor(
		logger: ILogger,
		port: number = 8000,
	)
	{
		this.logger = logger;

		this.app = express();
		this.router = express.Router();
		this.port = port;
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
		/* Using helmet.js to prevent common attacks. For more information see https://helmetjs.github.io/
		 */
		this.app.use(helmet());

		/* Setting up middleware to handle form data.
		 */
		this.app.use(express.json({ limit: 10000000 }));
		this.app.use(express.urlencoded({ extended: false }));

		/* Setting up the logging middleware to log all API requests.
		 */
		this.app.use((req: Request, res: Response, next: NextFunction) =>
		{
			this.logger.info(`${req.method} ${req.url} ${req.protocol.toUpperCase()}/${req.httpVersion}`);
			next();
		});

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
			/* Guard to prevent route test files from being public.
			 */
			if (typeof route === 'string' && route.includes('.route.ts') && !route.includes('.spec'))
			{
				require('./routes/' + route)(this.router);
			}
		});
	}
}