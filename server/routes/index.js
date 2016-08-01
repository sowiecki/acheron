/* eslint new-cap:0 */
import express from 'express';
import cors from 'cors';

import pingsController from '../controllers/pings';
import forwardController from '../controllers/forward';
import applicationView from '../views/application';
import { AUTHORIZED_HEADERS, AUTHORIZED_METHODS } from '../constants';

const router = express.Router();

router.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', AUTHORIZED_METHODS);
  res.header('Access-Control-Allow-Headers', AUTHORIZED_HEADERS);
  next();
});

router.post('/api/forward', (req, res) => forwardController.handle(req, res));

/* Room pings */
router.post('/api/ping', (req, res) => pingsController.handle(req, res));

/* Serve client - must be last route */
router.get('*', (req, res) => res.send(applicationView));

export default router;
