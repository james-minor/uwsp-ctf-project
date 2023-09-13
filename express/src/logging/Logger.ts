import { LogLevel } from './LogLevel';
import fs from 'fs';
import path from 'path';

export default class Logger
{
	public static outputToConsole: boolean = true;

	public static logDirectory: string = '/express/logs/';

	public static debug(message: string)
	{
		Logger.log(LogLevel.DEBUG, message);
	}

	public static info(message: string)
	{
		Logger.log(LogLevel.INFO, message);
	}

	public static warn(message: string)
	{
		Logger.log(LogLevel.WARN, message);
	}

	public static error(message: string)
	{
		Logger.log(LogLevel.ERROR, message);
	}

	public static log(level: LogLevel, message: string)
	{
		let logfile: string = path.join(Logger.logDirectory, `${new Date().getDate()}.txt`);
		let output: string = `[${new Date().toISOString()}] [${level}]: ${message}`;

		try
		{
			fs.appendFileSync(logfile, output);
		}
		catch (error)
		{
			console.log(error);
		}

		/* Handling the output to the dev console, if applicable.
		 */
		if(Logger.outputToConsole)
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