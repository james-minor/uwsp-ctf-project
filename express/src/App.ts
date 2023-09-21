import 'dotenv/config';
import { Pool } from 'pg';
import Server from './Server';
import Logger from './logging/Logger';

const port: number = 8000;
const logger = new Logger();
const maxClients: number = process.env.POSTGRES_MAX_CLIENTS === undefined ? 50 : parseInt(process.env.POSTGRES_MAX_CLIENTS);

/* The current environment type. Defaults to 'production', set to 'development' to output logging to the console,
 * and to allow for connection from any remote host. Even though with our current Docker Compose configuration outside
 * connections aren't possible in production mode, this serves as our last line of defense from outside users.
 */
const environmentType: 'development' | 'production' = (() =>
{
	if (process.env.ENVIRONMENT_TYPE == undefined)
	{
		logger.outputToConsole = false;
		logger.warn('ENVIRONMENT_TYPE environment variable not set. Defaulting to "production"...');
		return 'production';
	}

	switch(process.env.ENVIRONMENT_TYPE.toLowerCase())
	{
		case 'development':
			logger.outputToConsole = true;
			return 'development';
		default:
			logger.outputToConsole = false;
			return 'production';
	}
})();

/* Setting up the connection pool to the Postgres service.
 */
if (process.env.POSTGRES_PASSWORD === undefined)
{
	logger.error('Cannot access Postgres service. Stopping express service.');
	logger.error('Ensure the POSTGRES_PASSWORD environment variable is set.');
	process.exit();
}

const pool: Pool = new Pool({
	host: 'postgres',
	port: 5432,
	user: 'postgres',
	password: process.env.POSTGRES_PASSWORD,
	max: maxClients,
	database: 'ctf'
});

/* Validating that the pool is able to successfully connect to the Postgres service.
 */
pool.connect().then(() =>
{
	logger.info('Successfully connected to the Postgres service!');
}).catch(error =>
{
	logger.error('Could not connect to the Postgres service, stopping express service.');
	logger.error(error.message);
	process.exit();
});

/* Starting the API Server.
 */
const server = new Server(pool, logger, port, environmentType);
server.start();