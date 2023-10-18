import { Router } from 'express';
import * as waveController from '../controllers/wave.controller';
import adminGuard from '../auth/admin.guard';

module.exports = function (router: Router)
{
	router.get('/waves', [adminGuard, waveController.getAll]);

	router.get('/wave/:id', [adminGuard, waveController.get]);

	router.put('/wave/:id', [adminGuard, waveController.update]);

	router.post('/waves', [adminGuard, waveController.create]);

	router.delete('/wave/:id', [adminGuard, waveController.remove]);
}