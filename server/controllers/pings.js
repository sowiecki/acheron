import { find } from 'lodash';

import socketController from './socket';
import { NEW_ROOM_PING, PING_ERROR } from '../constants';
import { getHost } from '../utils';

const pingsController = {
  handlePing(req, res) {
    const { payload } = req;

    socketController.handle(NEW_ROOM_PING, payload)
  }
};

export default pingsController;
