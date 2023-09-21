import {LogLevel} from './LogLevel';

export default interface ILogger
{
	outputToFile: boolean;
	outputToConsole: boolean;
	logDirectory: string;

	debug: (message: string | number) => void;
	info: (message: string | number) => void;
	warn: (message: string | number) => void;
	error: (message: string | number) => void;

	log: (level: LogLevel, message: string | number) => void;
}