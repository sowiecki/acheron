import socketController from './socket';
import { NEW_ROOM_PING, NEW_ROOM_MOTION } from '../constants';
import { getResponseSetter } from '../utils';

const eventsMap = {
  ping: NEW_ROOM_PING,
  motion: NEW_ROOM_MOTION
};

const eventsController = {
  handle(req, res) {
    const { id, anchor } = req.headers;
    const setResponse = getResponseSetter(req.headers, res);
    const event = eventsMap[req.params.event];

    socketController.handle(event, {
      id,
      event,
      anchor
    }, { setResponse });
  }
};

export default eventsController;
