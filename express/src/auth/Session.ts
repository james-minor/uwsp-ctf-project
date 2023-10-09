import crypto from 'node:crypto';
import Client from '../Client';

export default class Session
{
	/**
	 * Generates and returns a cryptographically-secure randomly generated user session id.
	 * @return string The hex-encoded session string.
	 */
	static create(): string
	{
		/* Generating the user session.
		 */
		return crypto.randomBytes(24).toString('hex');
	}

	/**
	 * Validates a requested user session.
	 * @param session The user session key.
	 * @param checkForElevatedPrivileges Checks to see if the user has elevated privileges. NOTE: if set to true,
	 * this function will return false EVEN IF THE USER SESSION IS VALID.
	 */
	static async validate(session: string, checkForElevatedPrivileges: boolean = false): Promise<boolean>
	{
		return Client.session.findUnique({
			where: {
				key: session,
			},
		}).then(async (session): Promise<boolean> =>
		{
			if (!session)
			{
				return false;
			}

			if(checkForElevatedPrivileges)
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
}