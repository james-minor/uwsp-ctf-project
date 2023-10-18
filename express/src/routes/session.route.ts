import { Router } from 'express';
import * as sessionController from '../controllers/session.controller';

module.exports = function (router: Router)
{
	router.post('/session', sessionController.login);

	router.delete('/session', sessionController.logout);
}