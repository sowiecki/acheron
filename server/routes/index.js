/* eslint new-cap:0 */
import express from 'express';

import pingsController from '../controllers/pings';
import applicationView from '../views/application';

const router = express.Router();

/* Room pings */
router.post('/api/ping', (req, res) => pingsController.handlePing(req, res));

/* Serve client - must be last route */
router.get('*', (req, res) => res.send(applicationView));

export default router;
