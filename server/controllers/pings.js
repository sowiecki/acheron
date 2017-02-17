import socketController from './socket';
import { NEW_ROOM_PING } from '../constants';
import { getResponseSetter } from '../utils';

const pingsController = {
  handle(req, res) {
    const { id, anchor } = req.headers;
    const setResponse = getResponseSetter(req.headers, res);

    socketController.handle(NEW_ROOM_PING, {
      id,
      event: NEW_ROOM_PING,
      anchor
    }, { setResponse });
  }
};

export default pingsController;
