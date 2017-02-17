import socketController from './socket';
import { FORWARD } from '../constants';
import { getResponseSetter } from '../utils';

const forwardController = {
  handle(req, res) {
    const { headers, body } = req;
    const setResponse = getResponseSetter(headers, res);

    socketController.handle(FORWARD, { headers, body }, { setResponse });
  }
};

export default forwardController;
