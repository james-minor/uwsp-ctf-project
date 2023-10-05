import { LogLevel } from './LogLevel';
import fs from 'fs';
import path from 'path';
import ILogger from './ILogger';

export default class Logger implements ILogger
{
	public outputToFile: boolean = true;
	public outputToConsole: boolean = true;
	public logDirectory: string = '/express/logs/';

	debug(message: string | number)
	{
		this.log(LogLevel.DEBUG, message);
	}

	info(message: string | number)
	{
		this.log(LogLevel.INFO, message);
	}

	warn(message: string | number)
	{
		this.log(LogLevel.WARN, message);
	}

	error(message: string | number)
	{
		this.log(LogLevel.ERROR, message);
	}

	log(level: LogLevel, message: string | number)
	{
		let output: string = `[${new Date().toISOString()}] [${level}]: ${message.toString()}`;

		/* Handling the output to the log file, if applicable.
		 */
		if (this.outputToFile)
		{
			try
			{
				let logfile: string = path.join(this.logDirectory, `${new Date().toISOString().split('T')[0]}.txt`);
				fs.appendFileSync(logfile, output);
			}
			catch (error)
			{
				console.warn(`[${new Date().toISOString()}] [WARN]: ${error}`);
			}
		}

		/* Handling the output to the dev console, if applicable.
		 */
		if(this.outputToConsole)
		{
			switch(level)
			{
				case LogLevel.INFO:
				case LogLevel.DEBUG:
					console.log(output);
					break;
				case LogLevel.WARN:
					console.warn(output);
					break;
				case LogLevel.ERROR:
					console.error(output);
					break;
			}
		}
	}
}