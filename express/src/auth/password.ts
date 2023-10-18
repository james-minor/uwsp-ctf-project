import bcrypt from 'bcryptjs';

/**
 * Generates a password hash from a passed plain-text password.
 * @param password The plain text password to hash.
 */
export async function generatePasswordHash(password: string)
{
	return await bcrypt.hash(password, 11).then((hash) =>
	{
		return hash;
	});
}