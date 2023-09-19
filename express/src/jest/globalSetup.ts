import { execSync } from 'child_process';
import path from 'path';

export default function()
{
	const command = 'docker create --name postgres__temp postgres:15.4-alpine';
	execSync(command);

	const source = `${path.resolve('../postgres/')}\\.`;
	execSync(`docker cp ${source} postgres__temp/:/docker-entrypoint-initdb.d/`);
}