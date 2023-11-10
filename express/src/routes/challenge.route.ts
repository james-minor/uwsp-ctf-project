import { Router } from 'express';
import * as challengeController from '../controllers/challenge.controller';
import { adminGuard, userGuard } from '../auth/guard';

module.exports = function (router: Router)
{
	router.get('/challenges', [challengeController.getAll])

	router.post('/challenges', [adminGuard, challengeController.create])

	router.put('/challenge/:id(\\d+)', [adminGuard, challengeController.update]);

	router.delete('/challenge/:id(\\d+)', [adminGuard, challengeController.remove]);

	router.post('/challenge/:id(\\d+)/solve', [userGuard, challengeController.solve]);
}