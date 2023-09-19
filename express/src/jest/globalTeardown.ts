import { execSync } from 'child_process';

export default function()
{
	execSync('docker rm postgres__temp');
}