/* eslint new-cap:0 */
import express from 'express';

import eventsController from '../controllers/events';
import forwardController from '../controllers/forward';
import applicationView from '../views/application';
import { AUTHORIZED_HEADERS, AUTHORIZED_METHODS } from '../constants';

const router = express.Router();

router.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', AUTHORIZED_METHODS);
  res.header('Access-Control-Allow-Headers', AUTHORIZED_HEADERS);
  if ('OPTIONS' == req.method) {
    res.sendStatus(200);
  } else {
    next();
  }
});

router.post('/api/forward', (req, res) => forwardController.handle(req, res));

/* Room pings */
router.post('/api/:event', (req, res) => eventsController.handle(req, res));

/* AWS Healthcheck */
router.get('/health', (req, res) => {
  res.status(200).send('hello world');
});

/* Serve client - must be last route */
router.get('*', (req, res) => res.send(applicationView));

export default router;
