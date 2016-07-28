/* eslint new-cap:0, no-console:0 */
/* globals console */
import WebSocket from 'ws';
import { get, forEach, filter, merge } from 'lodash';

import { HANDSHAKE, RECONNECTED, FORWARD } from '../constants';
import { getWebSocketKey } from '../utils';

/**
 * Clients with active WebSocket connections.
 */
const clients = {};

/**
 * Deletes client from stored clients hash.
 * @param {object} client WebSocket properties for client.
 */
const flushClient = (client) => delete clients[getWebSocketKey(client)];

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
    this.wss = new WebSocket.Server({ server });

    this.open();
  },

  open() {
    this.wss.on('connection', (client) => {
      const initializePayload = {
        message: `Acheron connection established at ${JSON.stringify(new Date())}`
      };

      socketController.send(HANDSHAKE, initializePayload, client);

      client.on('message', (data) => {
        const message = JSON.parse(data);

        socketController.handle(message.event, message.payload, client);
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
  send(event, payload, client) {
    try {
      client.send(JSON.stringify({ event, payload }));
    } catch (e) {
      console.log(e);
    }
  },

  /**
   * WebSocket protocol for governing all outgoing socket communications.
   * @param {string} event Event constant that determines handling server-side.
   *  Sometimes passed to client.
   * @param {object} payload Payload to send to client.
   * @param {ws | undefined} client WebSocket object associated with specific targetted client.
   * @returns {undefined}
   */
  handle(event, payload, client) {
    const payloadId = get(payload, 'id');

    const handlers = {
      [HANDSHAKE]() {
        registerClient(client, payloadId);
      },

      [RECONNECTED]() {
        registerClient(client, payloadId);
      },

      [FORWARD]() {
        const clientsWithId = filter(clients, ({ id }) => id === payloadId);

        forEach(clientsWithId, (ws) => {
          socketController.send(event, payload, ws);
        });
      },

      sendToAll() {
        forEach(clients, (ws) => {
          socketController.send(event, payload, ws);
        });
      }
    };

    return handlers[event] ? handlers[event]() : handlers.sendToAll();
  }
};

export default socketController;
