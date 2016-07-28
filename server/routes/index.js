/* eslint new-cap:0 */
import express from 'express';

import pingsController from '../controllers/pings';
import forwardController from '../controllers/forward';
import applicationView from '../views/application';

const router = express.Router();

router.post('/api/forward', (req, res) => forwardController.handle(req, res));

/* Room pings */
router.post('/api/ping', (req, res) => pingsController.handle(req, res));

/* Serve client - must be last route */
router.get('*', (req, res) => res.send(applicationView));

export default router;
