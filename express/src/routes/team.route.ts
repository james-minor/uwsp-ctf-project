import { Router } from 'express';
import * as teamController from '../controllers/team.controller';
import { adminGuard } from '../auth/guard';

module.exports = function (router: Router)
{
	router.get('/teams', [teamController.getAll]);

	router.delete('/team/:id(\\d+)', [adminGuard, teamController.remove])
}