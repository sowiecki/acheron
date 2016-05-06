/* eslint no-console:0 */
/* globals console */
import WebSocket from 'ws';
import http from 'http';
import express from 'express';
import favicon from 'serve-favicon';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import colors from 'colors/safe';

import { SERVER_PORT,
         CLIENT_WEB_SOCKET_PORT,
         PUBLIC_PATH,
         VIEWS_PATH } from './config';
import routes from './routes';

const app = express();

app.use(logger('dev'));
app.use(favicon(`${PUBLIC_PATH}/favicon.ico`));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.set('port', SERVER_PORT);
app.set('views', VIEWS_PATH);
app.use('/', express.static(PUBLIC_PATH));
app.use('/', routes);

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

server.listen(SERVER_PORT, (err) => {
  if (err) {
    console.log(err);
    return;
  }

  console.log(`Listening at http://localhost:${SERVER_PORT}`);
});

wss.on('connection', (ws) => {
  const id = setInterval(() => {
    ws.send(JSON.stringify(new Date()), () => {  });
  }, 1000);

  console.log('websocket connection open');

  ws.on('close', () => {
    console.log('websocket connection close');
    clearInterval(id);
  });
});

export default { server, wss };
