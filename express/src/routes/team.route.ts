import { Router } from 'express';
import * as teamController from '../controllers/team.controller';

module.exports = function (router: Router)
{
	router.get('/teams', [teamController.getAll]);
}