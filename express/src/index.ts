import express, {Express, NextFunction, Request, Response, Router} from 'express';
import 'dotenv/config';
import Logger from './logging/Logger';

const port: number = 8000;  // Always use port 8000, as the port is remapped via Compose using our env var EXPRESS_PORT.
const app: Express = express();
const router: Router = express.Router();

/* Logging middleware.
 */
app.use((req: Request, res: Response, next: NextFunction) =>
{
	Logger.info(req.ip);
	(req.method);
	//Logger.info(req.baseUrl); // No
	//Logger.info(req.protocol) // Not rly useful but maybe.
	Logger.info(req.route);  // Is undefined, see if its NOT when a route is found.

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
	Logger.outputToConsole = process.env.ENVIRONMENT_TYPE === 'development';
	Logger.info(`Express API listening on port ${port}...`);
});

router.get('/', (req: Request, res: Response) =>
{
	res.status(400).json({body: 'Hello world!'});
});