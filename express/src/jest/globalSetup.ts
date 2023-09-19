import { execSync } from 'child_process';
import path from 'path';

module.exports = function ()
{
	const command = 'docker create postgres:15.4-alpine';
	global.POSTGRES_DOCKER_ID = execSync(command).toString();

	console.log(path.resolve('../postgres/'));

	const name = execSync(`docker inspect --format="{{.Name}}" ${global.POSTGRES_DOCKER_ID}`).toString();
	const source = `${path.resolve('../postgres/')}\\.`;
	const target = `${name.replace('/', '').replace('\n', '')}`;

	execSync(`docker cp ${source} ${target}:/docker-entrypoint-initdb.d/`);
}