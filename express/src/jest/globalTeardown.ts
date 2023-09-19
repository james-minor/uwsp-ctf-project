import { execSync } from 'child_process';

module.exports = function()
{
	const command = `docker rm -f ${global.POSTGRES_DOCKER_ID}`;
	execSync(command);
}