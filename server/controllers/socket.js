/* eslint new-cap:0, no-console:0 */
/* globals console */
import WebSocket from 'ws';
import { get, forEach, filter, merge } from 'lodash';

import { HANDSHAKE, RECONNECTED, FORWARD, SOCKET_HEARTBEAT_INTERVAL } from '../constants';
import { getWebSocketKey } from '../utils';

/**
 * Clients with active WebSocket connections.
 */
const clients = {};

/**
 * Deletes client from stored clients hash.
 * @param {object} client WebSocket properties for client.
 */
const flushClient = client => delete clients[getWebSocketKey(client)];

/**
 * Registers client with stored clients hash.
 * Overwrites clients from same origin.
 * @param {object} client WebSocket properties for client.
 */
const registerClient = (client, clientId) => {
  const origin = getWebSocketKey(client);

  clients[origin] = merge(client, {
    id: clientId
  });
};

const socketController = {
  initialize(server) {
    this.wss = new WebSocket.Server({ server, port: 5001 });
    this.wss.on('connection', ws => {
      ws.isAlive = true;
      ws.on('pong', () => (ws.isAlive = true));
    });

    this.monitor();

    this.open();
  },

  // An attempt to remedy Heroku apparently dropping WebSocket connections on sleeping dynos
  // https://www.npmjs.com/package/ws#how-to-detect-and-close-broken-connections
  monitor() {
    setInterval(() => {
      this.wss.clients.forEach(ws => {
        if (ws.isAlive === false) return ws.terminate();

        ws.isAlive = false;
        ws.ping(() => {});
      });
    }, SOCKET_HEARTBEAT_INTERVAL);
  },

  open() {
    this.wss.on('connection', client => {
      const initializePayload = {
        event: HANDSHAKE,
        message: `Acheron connection established at ${JSON.stringify(new Date())}`
      };

      socketController.send(initializePayload, client);

      client.on('message', data => {
        const message = JSON.parse(data);

        socketController.handle(message.event, message.payload, { client });
      });

      client.on('close', () => flushClient(client));
    });
  },

  /**
   * Middleware function for all open socket communication.
   * Fails gracefully if communication with client fails unexpectedly.
   * @param {string} event Event constant that determines handling client-side.
   * @param {object} payload Payload to send to client.
   * @param {ws} client WebSocket object associated with specific targetted client.
   * @returns {undefined}
   */
  send(payload, client) {
    try {
      client.send(JSON.stringify({ payload }));
    } catch (e) {
      console.log(e);
    }
  },

  /**
   * WebSocket protocol for governing all outgoing socket communications.
   * @param {string} event - Event constant that determines handling server-side.
   * @param {object} payload - Payload to send to client.
   * @param {ws | undefined} client - WebSocket object associated with specific targetted client.
   * @returns {undefined}
   */
  handle(event, payload, { client, setResponse }) {
    const clientId = get(payload, 'headers.id') || get(payload, 'id');

    const handlers = {
      [HANDSHAKE]() {
        registerClient(client, clientId);
      },

      [RECONNECTED]() {
        registerClient(client, clientId);
      },

      [FORWARD]() {
        const clientsWithId = filter(clients, ({ id }) => id === clientId);

        forEach(clientsWithId, ws => socketController.send(payload, ws));

        setResponse(clientsWithId);
      }
    };

    return handlers[event] ? handlers[event]() : handlers[FORWARD]();
  }
};

export default socketController;
