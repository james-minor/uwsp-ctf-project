import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import * as teamController from '../controllers/team.controller';
import * as sessionController from '../controllers/session.controller';
import userGuard from '../auth/user.guard';
import adminGuard from '../auth/admin.guard';

module.exports = function (router: Router)
{
	router.get('/user', [userGuard, userController.getPrivateUserData]);

	router.get('/users', [adminGuard, userController.getAll]);

	router.get('/user/:id(\\d+)', [userController.getPublicUserData])

	router.post('/user', [userController.register, teamController.create, sessionController.login]);

	router.put('/user', [userGuard, userController.updatePassword]);

	router.put('/user/:id(\\d+)', [adminGuard, userController.updateRole]);

	router.delete('/user', [userGuard, userController.remove]);

	router.delete('/user/:id(\\d+)', [adminGuard, userController.kick]);
}