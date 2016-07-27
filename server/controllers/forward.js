import socketController from './socket';
import { FORWARD } from '../constants';

const forwardController = {
  handlePing(req, res) {
    const { id } = req.headers;

    socketController.handle(FORWARD, { id });

    res.json({ status: 200, message: `Forwarding payload to ${id}.` });
  }
};

export default forwardController;
