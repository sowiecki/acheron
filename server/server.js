/* eslint no-console:0 */
/* globals console */
import express from 'express';
import favicon from 'serve-favicon';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import colors from 'colors/safe';

import { SERVER_PORT, PUBLIC_PATH, VIEWS_PATH } from './config';
import routes from './routes';

const server = express();

/* Remaining Express configuration */
server.use(logger('dev'));
server.use(favicon(`${PUBLIC_PATH}/favicon.ico`));
server.use(cookieParser());
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: false }));
server.set('port', SERVER_PORT);
server.set('views', VIEWS_PATH);
server.use('/', express.static(PUBLIC_PATH));
server.use('/', routes);

const app = server.listen(SERVER_PORT, (err) => {
  if (err) {
    console.log(err);
    return;
  }

  console.log(`Listening at http://localhost:${SERVER_PORT}`);
});

export default app;
