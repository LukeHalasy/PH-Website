import * as express from 'express';
import axios from 'axios';
import { successRes, errorRes } from '../utils';
import { syncFacebookEvents } from '../utils/syncFacebookEvents';
export const router = express.Router();

router.get('/facebook', async (req, res) => {
	try {
		syncFacebookEvents();
		return successRes(res, 'Okay');
	} catch (error) {
		return errorRes(res, 500, error);
	}
});
