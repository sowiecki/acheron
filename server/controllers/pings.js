import socketController from './socket';
import { NEW_ROOM_PING } from '../constants';

const pingsController = {
  handle(req, res) {
    const { id, anchor } = req.headers;

    socketController.handle(NEW_ROOM_PING, {
      id,
      event: NEW_ROOM_PING,
      anchor
    });

    res.json({ status: 200, message: `Ping received from ${anchor} for ${id}.` });
  }
};

export default pingsController;
