import { Router } from 'express';
import * as categoryController from '../controllers/category.controller';
import { adminGuard } from '../auth/guard';

module.exports = function (router: Router)
{
	router.get('/categories', [categoryController.getAll]);

	router.post('/categories', [adminGuard, categoryController.create]);

	router.put('/category/:id(\\d+)', [adminGuard, categoryController.update]);

	router.delete('/category/:id(\\d+)', [adminGuard, categoryController.remove]);
}