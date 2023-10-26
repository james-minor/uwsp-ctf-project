import { Router } from 'express';
import * as sessionController from '../controllers/session.controller';
import { userGuard } from '../auth/guard';

module.exports = function (router: Router)
{
	router.post('/session', sessionController.login);

	router.delete('/session', [userGuard, sessionController.logout]);
}