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

import { CLIENT_WEB_SOCKET_PORT,
         ACHERON_WEB_SOCKET_PORT,
         SERVER_PORT,
         PUBLIC_PATH,
         VIEWS_PATH } from './config';
import routes from './routes';

const server = express();

server.use(logger('dev'));
server.use(favicon(`${PUBLIC_PATH}/favicon.ico`));
server.use(cookieParser());
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: false }));
server.set('port', SERVER_PORT);
server.set('views', VIEWS_PATH);
server.use('/', express.static(PUBLIC_PATH));
server.use('/', routes);

const wssServer = http.createServer(server);

server.listen(SERVER_PORT, (err) => {
  if (err) {
    console.log(err);
    return;
  }

  console.log(`Listening at http://localhost:${SERVER_PORT}`);
});

const wss = new WebSocket.Server({ server: wssServer })
console.log('websocket server created');

wssServer.listen(ACHERON_WEB_SOCKET_PORT);

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
