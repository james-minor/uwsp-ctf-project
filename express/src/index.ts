import express, {Express, NextFunction, Request, Response, Router} from 'express';
import 'dotenv/config';
import Logger from './logging/Logger';
import { Pool } from 'pg';

const port: number = 8000;  // Always use port 8000, as the port is remapped via Compose using our env var EXPRESS_PORT.
const app: Express = express();
const router: Router = express.Router();

Logger.outputToConsole = process.env.ENVIRONMENT_TYPE === 'development';

/* Setting up the connection pool to the Postgres service.
 */
if (process.env.POSTGRES_USERNAME === undefined || process.env.POSTGRES_PASSWORD === undefined)
{
	Logger.error('Cannot access Postgres service. Stopping express service.');
	Logger.error('Ensure POSTGRES_USERNAME and POSTGRES_PASSWORD environment variables are set.');
}

const pool: Pool = new Pool({
	host: 'postgres',
	port: 5432,
	user: process.env.POSTGRES_USERNAME,
	password: process.env.POSTGRES_PASSWORD,
	max: 50,
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
 * container.
 */
app.use((req: Request, res: Response, next: NextFunction) =>
{
	if (req.ip === 'https://astro:4321' || req.ip === 'http://astro:4321')
	{
		next();
	}

	res.status(403).json({error: 'Attempted access from invalid remote host.'});
});

/* Initializing the Express router.
 */
app.use('/api/v1/', router);

/* Starting the express server.
 */
app.listen(port, () =>
{
	Logger.info(`Express API listening on port ${port}...`);
});