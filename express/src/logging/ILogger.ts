import {LogLevel} from './LogLevel';

export default interface ILogger
{
	outputToFile: boolean;
	outputToConsole: boolean;
	logDirectory: string;

	debug: (message: string) => void;
	info: (message: string) => void;
	warn: (message: string) => void;
	error: (message: string) => void;

	log: (level: LogLevel, message: string) => void;
}