import socketController from './socket';
import { NEW_ROOM_PING } from '../constants';

const pingsController = {
  handle(req, res) {
    const { id, anchor } = req.headers;

    socketController.handle(NEW_ROOM_PING, { id, anchor });

    res.json({ status: 200, message: `Ping received for ${id} at ${anchor}.` });
  }
};

export default pingsController;
