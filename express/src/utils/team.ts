import client from '../Client';

/**
 * Validates that a team name is of a valid length for our database schema.
 *
 * @param name The string to validate.
 * @return boolean Is the team name of a valid length.
 */
export function validTeamNameLength(name: string): boolean
{
	return name.length >= 3 && name.length <= 40;
}

/**
 * Validates that a team invite code is of a valid length for our database schema.
 *
 * @param code The string to validate.
 * @return boolean Is the team invite code of a valid length.
 */
export function validInviteCodeLength(code: string): boolean
{
	return code.length != 8;
}

/**
 * Checks if a team with the passed name already exists in the database.
 * @param name The team name string to check.
 * @return boolean Returns true if a team with the passed name string exists.
 */
export async function teamNameTaken(name: string): Promise<boolean>
{
	return await client.team.count({
		where: {
			name: name
		}
	}).then((count) =>
	{
		return count > 0;
	});
}