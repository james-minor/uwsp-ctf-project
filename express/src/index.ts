import express, {Express, NextFunction, Request, Response, Router} from 'express';
import 'dotenv/config';
import Logger from './logging/Logger';
import { Pool } from 'pg';

const port: number = 8000;  // Always use port 8000, as the port is remapped via Compose using our env var EXPRESS_PORT.
const maxClients: number = process.env.POSTGRES_MAX_CLIENTS === undefined ? 50 : parseInt(process.env.POSTGRES_MAX_CLIENTS);
const app: Express = express();
const router: Router = express.Router();

/* The current environment type. Defaults to 'production', set to 'development' to output logging to the console,
 * and to allow for connection from any remote host.
 */
const environmentType: 'development' | 'production' = (() =>
{
	if (process.env.ENVIRONMENT_TYPE == undefined)
	{
		Logger.warn('ENVIRONMENT_TYPE environment variable not set. Defaulting to "production"...');
		return 'production';
	}

	switch(process.env.ENVIRONMENT_TYPE.toLowerCase())
	{
		case 'development':
			return 'development';
		default:
			return 'production';
	}
})();

Logger.outputToConsole = environmentType === 'development';

/* Setting up the connection pool to the Postgres service.
 */
if (process.env.POSTGRES_PASSWORD === undefined)
{
	Logger.error('Cannot access Postgres service. Stopping express service.');
	Logger.error('Ensure the POSTGRES_PASSWORD environment variable is set.');
}

const pool: Pool = new Pool({
	host: 'postgres',
	port: 5432,
	user: 'postgres',
	password: process.env.POSTGRES_PASSWORD,
	max: maxClients,
});

/* Validating that the pool is able to successfully connect to the Postgres service.
 */
pool.connect().then(() =>
{
	Logger.info('Successfully connected to the Postgres service!');
}).catch(error =>
{
	Logger.error('Could not connect to the Postgres service, stopping express service.');
	Logger.error(error.message);
	process.exit();
});

/* Logging middleware.
 */
app.use((req: Request, res: Response, next: NextFunction) =>
{
	Logger.info(`${req.method} ${req.url} ${req.protocol.toUpperCase()}/${req.httpVersion}`);
	next();
});

/* Application-level middleware that will prevent API access unless the remote host is our Astro service
 * container. (Note: this only happens in PRODUCTION mode, in DEVELOPMENT mode any remote host can access
 * the API).
 */
if (environmentType === 'production')
{
	app.use((req: Request, res: Response, next: NextFunction) =>
	{
		if (req.ip === 'https://astro:4321' || req.ip === 'http://astro:4321')
		{
			next();
		}

		res.status(403).json({error: 'Attempted access from invalid remote host.'});
	});
}

/* Initializing the Express router.
 */
app.use('/api/v1/', router);

/* Starting the express server.
 */
app.listen(port, () =>
{
	Logger.info(`Express API listening on port ${port}...`);
});

router.get('/admin/count', (req: Request, res: Response) =>
{
	pool.query(`
		SELECT COUNT(*) 
		FROM user_accounts
		WHERE role='ADMIN'
		`
	).then(result =>
	{
		res.status(200).json({
			count: result.rows[0].count
		});
	});
});
