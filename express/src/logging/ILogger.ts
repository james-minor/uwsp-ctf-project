import {LogLevel} from './LogLevel';

export default interface ILogger
{
	outputToConsole: boolean;
	logDirectory: string;

	debug: (message: string) => void;
	info: (message: string) => void;
	warn: (message: string) => void;
	error: (message: string) => void;

	log: (level: LogLevel, message: string) => void;
}