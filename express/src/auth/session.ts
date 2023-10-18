import crypto from 'node:crypto';

/**
 * Generates and returns a cryptographically-secure randomly generated user session id.
 * @return string The hex-encoded session string.
 */
export function generateSession(): string
{
	/* Generating the user session.
	 */
	return crypto.randomBytes(24).toString('hex');
}