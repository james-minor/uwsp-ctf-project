import bcrypt from 'bcryptjs';
import Client from '../Client';

export default class Password
{
	/**
	 * Generates a password hash from a passed plain-text password.
	 * @param password The plain text password to hash.
	 */
	static async create(password: string)
	{
		return await bcrypt.hash(password, 15).then((hash) =>
		{
			return hash;
		});
	}

	/**
	 * Validates a username and password are valid.
	 * @param username The plain text username to validate.
	 * @param password The plain text password to validate.
	 */
	static async validate(username: string, password: string)
	{
		return Client.user.findUnique({
			where: {
				username: username
			}
		}).then(async (user) =>
		{
			if (!user)
			{
				return false;
			}

			return await bcrypt.compare(password, user.passwordHash)
		});
	}
}