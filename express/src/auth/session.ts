import crypto from 'node:crypto';
import Client from '../Client';

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

/**
 * Authenticates a user session.
 *
 * @param token The session token to authenticate.
 * @param checkElevatedPrivilege Whether or not to check if the session's user has admin privileges.
 *
 * @returns Promise<boolean> True if the session token was valid.
 */
export default async function validateSession(token: string, checkElevatedPrivilege: boolean): Promise<boolean>
{
	try
	{
		return Client.session.findUnique({
			where: {
				key: token,
			},
		}).then((session) =>
		{
			/* Checking if the session exists.
			 */
			if (!session)
			{
				return false;
			}

			/* Checking if the session is expired.
			 */
			const expiryDate = new Date(session.creationDate.toISOString() + session.maxAgeSeconds * 1000);
			if (expiryDate < new Date())
			{
				return false;
			}

			/* Checking if the session user has elevated privileges, if applicable.
			 */
			if (checkElevatedPrivilege)
			{
				return Client.user.findUnique({
					where: {
						id: session.userId,
					},
				}).then((user): boolean =>
				{
					if (!user)
					{
						return false;
					}

					return user.role === 'ADMIN';
				});
			}

			return true;
		});
	}
	catch (e)
	{
		return false;
	}
}