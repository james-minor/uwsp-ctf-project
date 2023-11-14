import { Router } from 'express';
import * as captureController from '../controllers/capture.controller';

module.exports = function (router: Router)
{
	router.get('/captures', [captureController.getAll]);
}