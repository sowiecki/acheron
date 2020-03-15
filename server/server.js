/* eslint no-console:0 */
/* globals console */
import https from 'https';
import fs from 'fs';
import express from 'express';
import favicon from 'serve-favicon';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';

import { SERVER_PORT, PUBLIC_PATH, VIEWS_PATH } from './config';
import socketController from './controllers/socket';
import routes from './routes';

const app = express();
const key = fs.readFileSync('../key.pem');
const cert = fs.readFileSync('../cert.pem');

app.use(logger('dev'));
app.use(favicon(`${PUBLIC_PATH}/favicon.ico`));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.set('port', SERVER_PORT);
app.set('views', VIEWS_PATH);
app.use('/', express.static(PUBLIC_PATH));
app.use('/', routes);

// const server = http.createServer(app);
const server = https.createServer({key: key, cert: cert }, app);

server.listen(SERVER_PORT, (err) => {
  if (err) {
    console.log(err);
    return;
  }

  console.log(`Listening at http://localhost:${SERVER_PORT}`);
});

socketController.initialize(server);

export default { server };
