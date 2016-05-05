/* eslint new-cap:0, no-console:0 */
/* globals console */
import WebSocket from 'ws';

import { WEB_SOCKET_PORT } from '../config';
import { EMIT_CLIENT_CONNECTED, EMIT_FLUSH_CLIENT } from '../ducks/clients';
import { HANDSHAKE,
         RECONNECTED,
         NEW_ROOM_PING } from '../constants';

const wss = new WebSocket.Server({ port: WEB_SOCKET_PORT });

/**
 * Clients with active WebSocket connections.
 */
const clients = {};

/**
 * Deletes client from stored clients hash.
 * @param {object} client WebSocket properties for client.
 */
const flushClient = (client) => delete clients[getOrigin(client)];

/**
 * Registers client with stored clients hash.
 * Overwrites clients from same origin.
 * @param {string} anchor Anchor key of client.
 * @param {object} client WebSocket properties for client.
 */
const registerClient = (client) => {
  const origin = getOrigin(client);

  clients[origin] = Object.assign(client, { anchor });
};

const socketController = {
  /**
   * Sets up and initializes socket connection with client.
   * @params{string} event Event constant for initial communication with client.
   * @returns {undefined}
   */
  open(event, payload) {
    wss.on('connection', (client) => {
      socketController.send(event, payload, client); // Initialize with config

      client.on('message', (data) => {
        const message = JSON.parse(data);

        socketController.handle(message.event, message.payload, client);
      });

      client.on('close', () => {
        flushClient(client);
      });
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
    const handlers = {
      [HANDSHAKE]() {
        registerClient(client);
      },

      [RECONNECTED]() {
        registerClient(client);
      },

      [NEW_ROOM_PING]() { // Forward ping to GTFO

      },

      sendToAll() {
        clients.forEach((ws) => {
          socketController.send(event, payload, ws);
        });
      }
    };

    return handlers[event] ? handlers[event]() : handlers.sendToAll();
  }
};

export default socketController;
