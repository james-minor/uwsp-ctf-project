import { NextFunction, Request, Response } from 'express';
import { APIResponse } from '../interfaces/APIResponse';
import client from '../Client';
import { teamNameTaken, validInviteCodeLength, validTeamNameLength } from '../utils/team';
import crypto from 'node:crypto';

export async function getAll(req: Request, res: Response<APIResponse>)
{
	await client.team.findMany({})
		.then((teams) =>
		{
			res.status(200).json({
				success: true,
				data: {
					teams: teams,
				}
			});
		});
}

export async function create(req: Request, res: Response<APIResponse>, next: NextFunction)
{
	let errors: {
		teamName: string | undefined,
		inviteCode: string | undefined,
	} = {
		teamName: undefined,
		inviteCode: undefined,
	};

	/* Validating team name.
	 */
	if (!validTeamNameLength(req.body.teamName))
	{
		errors.teamName = 'Team name must be between 3-40 characters.';
	}

	/* Validating the invite code, if applicable.
	 */
	if (await teamNameTaken(req.body.teamName))
	{
		if (!validInviteCodeLength(req.body.inviteCode))
		{
			errors.inviteCode = 'Invite code must be 8 characters.';
		}
	}

	/* Sending back errors, if any.
	 */
	if (errors.teamName || errors.inviteCode)
	{
		res.status(400).json({
			success: false,
			errors: [
				{
					key: 'teamName',
					message: errors.teamName ? errors.teamName : ''
				},
				{
					key: 'inviteCode',
					message: errors.inviteCode ? errors.inviteCode : ''
				}
			]
		});
		return;
	}

	/* Creating the team, if needed.
	 */
	// TODO: clean up this branching mess
	if (!await teamNameTaken(req.body.teamName))
	{
		/* Generating the random invite code.
		 */
		const inviteCode = crypto.randomBytes(4).toString('hex');

		/* Creating the new team.
		 */
		await client.team.create({
			data: {
				name: req.body.teamName,
				inviteCode: inviteCode,
			}
		}).then(async (team) =>
		{
			/* Adding the user to the newly created team.
			 */
			await client.user.update({
				where: {
					username: req.body.username
				},
				data: {
					teamId: team.id,
				}
			}).then(() =>
			{
				next();
			});
		}).catch(() =>
		{
			res.status(500).json({
				success: false,
			});
		});
	}
	else
	{
		/* Validating the user entered the correct invite code.
		 */
		await client.team.findUnique({
			where: {
				name: req.body.teamName,
				inviteCode: req.body.inviteCode,
			}
		}).then(async (team) =>
		{
			if (team)
			{
				/* Adding the user to the existing team.
				 */
				await client.user.update({
					where: {
						username: req.body.username
					},
					data: {
						teamId: team.id,
					}
				}).then(() =>
				{
					next();
				});
			}
			else
			{
				res.status(400).json({
					success: false,
					errors: [
						{ key: 'inviteCode', message: 'Incorrect invite code.' }
					]
				});
			}
		}).catch(() =>
		{
			res.status(500).json({
				success: false,
			});
		});
	}
}