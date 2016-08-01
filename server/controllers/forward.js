import socketController from './socket';
import { FORWARD } from '../constants';

const forwardController = {
  handle(req, res) {
    const { id, event } = req.headers;
console.log('foobar', id, event, req.body)
    const payload = {
      body: req.body,
      event,
      id
    };

    socketController.handle(FORWARD, payload);

    res.json({ status: 200, message: `Forwarding payload to ${id}.` });
  }
};

export default forwardController;
