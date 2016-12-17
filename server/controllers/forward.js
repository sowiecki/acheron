import { merge } from 'lodash';

import socketController from './socket';
import { FORWARD } from '../constants';

const forwardController = {
  handle(req, res) {
    const { headers, body } = req;

    socketController.handle(FORWARD, { headers, body });

    res.json({ status: 200, message: `Forwarding ${headers.event}.` });
  }
};

export default forwardController;
