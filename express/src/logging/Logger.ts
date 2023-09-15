import { LogLevel } from './LogLevel';
import fs from 'fs';
import path from 'path';
import ILogger from './ILogger';

export default class Logger implements ILogger
{
	public outputToConsole: boolean = true;
	public logDirectory: string = '/express/logs/';

	debug(message: string)
	{
		this.log(LogLevel.DEBUG, message);
	}

	info(message: string)
	{
		this.log(LogLevel.INFO, message);
	}

	warn(message: string)
	{
		this.log(LogLevel.WARN, message);
	}

	error(message: string)
	{
		this.log(LogLevel.ERROR, message);
	}

	log(level: LogLevel, message: string)
	{
		let logfile: string = path.join(this.logDirectory, `${new Date().toISOString().split('T')[0]}.txt`);
		let output: string = `[${new Date().toISOString()}] [${level}]: ${message}`;

		try
		{
			fs.appendFileSync(logfile, output);
		}
		catch (error)
		{
			console.warn(error);
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