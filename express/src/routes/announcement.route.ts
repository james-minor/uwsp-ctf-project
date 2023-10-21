import { Router } from 'express';
import * as announcementController from '../controllers/announcement.controller';
import adminGuard from '../auth/admin.guard';

module.exports = function (router: Router)
{
	router.get('/announcements', [announcementController.getAll]);

	router.get('/announcements/poll', [announcementController.poll]);

	router.post('/announcements', [adminGuard, announcementController.create]);

	router.put('/announcement/:id(\\d+)', [adminGuard, announcementController.update]);

	router.delete('/announcement/:id(\\d+)', [adminGuard, announcementController.remove]);
}