import socketController from './socket';
import { FORWARD } from '../constants';

const forwardController = {
  handle(req, res) {
    const { headers, body } = req;
    const { event, id } = headers;

    socketController.handle(FORWARD, { body, event, id });

    res.json({ status: 200, message: `Forwarding ${event}.` });
  }
};

export default forwardController;
