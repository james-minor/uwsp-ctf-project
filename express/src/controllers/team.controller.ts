import { NextFunction, Request, Response } from 'express';
import { APIResponse } from '../interfaces/APIResponse';
import client from '../Client';
import { teamNameTaken, validInviteCodeLength, validTeamNameLength } from '../utils/team';
import crypto from 'node:crypto';
import { Team } from '@prisma/client';
import bcrypt from 'bcryptjs';

export async function getAll(req: Request, res: Response<APIResponse>)
{
	await client.team.findMany({
		select: {
			id: true,
			name: true,
		}
	})
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
	let team: Team | undefined = undefined;

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
	if (req.body['createNewTeam'] === true && await teamNameTaken(req.body.teamName))
	{
		errors.teamName = 'Team name is taken.'
	}

	if (await teamNameTaken(req.body.teamName) && !validInviteCodeLength(req.body.inviteCode))
	{
		errors.inviteCode = 'Invite code must be 8 characters.';
	}

	/* Attempting to authenticate an existing team using the invite code.
	 */
	if (await teamNameTaken(req.body.teamName))
	{
		await client.team.findUnique({
			where: {
				name: req.body.teamName,
				inviteCode: req.body.inviteCode,
			}
		}).then((result) =>
		{
			if(result)
			{
				team = result;
			}
			else
			{
				errors.inviteCode = 'Incorrect invite code.';
			}
		});
	}
	/* Attempting to create a new team.
	 */
	else
	{
		/* Generating the random invite code.
		 */
		const inviteCode = crypto.randomBytes(4).toString('hex');

		/* Creating the new team.
		 */
		team = await client.team.create({
			data: {
				name: req.body.teamName,
				inviteCode: inviteCode,
			}
		}).then((result) =>
		{
			if (result)
			{
				return result;
			}
		});
	}

	/* Sending back errors, if any.
	 */
	if (errors.teamName || errors.inviteCode)
	{
		/* A new user entry has already been created, so we need to delete that before returning data to the client.
		 */
		await client.user.delete({
			where: {
				username: req.body.username,
			}
		});

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

	/* Adding the user to the team.
	 */
	await client.user.findUnique({
		where: {
			username: req.body.username
		}
	}).then((user) =>
	{
		return !!(user && bcrypt.compare(req.body.password, user.passwordHash));
	}).then(async (authenticated) =>
	{
		if (authenticated && team)
		{
			await client.user.update({
				where: {
					username: req.body.username,
				},
				data: {
					teamId: team.id,
				}
			});

			next();
		}
	}).catch(() =>
	{
		res.status(500).json({
			success: false,
		});
	});
}

export async function remove(req: Request, res: Response<APIResponse>, next: NextFunction)
{
	await client.team.delete({
		where: {
			id: parseInt(req.params['id']),
		},
	}).then(() =>
	{
		res.status(200).json({
			success: true,
		});
	}).catch(() =>
	{
		res.status(500).json({
			success: false,
		});
	})
}