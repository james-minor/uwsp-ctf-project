import client from '../Client';

/**
 * Validates that a username is of a valid length for our database schema.
 *
 * @param username The string to validate.
 * @return boolean Returns true if the username is of a valid length.
 */
export function validUsernameLength(username: string): boolean
{
	return (username.length > 3 && username.length < 30);
}

/**
 * Checks if a user with the passed username already exists in the database.
 * @param username The string to check.
 * @return boolean Returns true if a user with the passed username string exists.
 */
export async function usernameTaken(username: string): Promise<boolean>
{
	return await client.user.count({
		where: {
			username: username
		}
	}).then((count) =>
	{
		return count > 0;
	});
}