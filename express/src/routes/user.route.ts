import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import userGuard from '../auth/user.guard';
import adminGuard from '../auth/admin.guard';

module.exports = function (router: Router)
{
	router.post('/user', userController.register);

	router.put('/user', [userGuard, userController.updateInfo]);

	router.delete('/user', [userGuard, userController.remove]);

	router.delete('/user/:id', [adminGuard, userController.kick]);
}