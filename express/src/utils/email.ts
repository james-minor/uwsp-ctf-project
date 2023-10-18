import client from '../Client';

/**
 * Validates that an email is of a valid length for our database schema.
 *
 * @param email The string to validate.
 * @return boolean Is the email of a valid length.
 */
export function validEmailLength(email: string): boolean
{
	return email.length <= 75;
}

/**
 * Checks if a passed string is a valid email.
 *
 * @param email The string to validate.
 * @return boolean Returns true if the email is valid, false otherwise.
 */
export function validEmail(email: string): boolean
{
	/* Thanks to https://stackoverflow.com/a/201378 for the regular expression.
	 */
	const emailRegex = new RegExp('(?:[a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])\\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)])');

	return emailRegex.test(email)
}

/**
 * Checks if a user with the passed email already exists in the database.
 * @param email The string to check.
 * @return boolean Returns true if a user with the passed email string exists.
 */
export async function emailTaken(email: string): Promise<boolean>
{
	return await client.user.count({
		where: {
			email: email
		}
	}).then((count) =>
	{
		return count > 0;
	});
}