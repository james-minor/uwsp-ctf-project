import { Router } from 'express';
import * as attachmentController from '../controllers/attachment.controller';
import { adminGuard } from '../auth/guard';

module.exports = function (router: Router)
{
	router.get('/attachment/:id(\\d+)', [attachmentController.get])

	router.get('/attachments', [adminGuard, attachmentController.getAll]);

	router.post('/attachments', [adminGuard, attachmentController.create]);

	router.put('/attachment/:id(\\d+)', [adminGuard, attachmentController.update]);

	router.delete('/attachment/:id(\\d+)', [adminGuard, attachmentController.remove]);
}