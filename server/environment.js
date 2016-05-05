/* eslint array-callback-return:0 */
import path from 'path';
import { readFileSync } from 'fs';

import { isTest } from './config';
import validator from '../environment/validation';

const readFile = (fileName) => {
  const filePath = path.join('./environment', fileName);

  return JSON.parse(readFileSync(filePath, 'utf8'));
};

/**
 * Reads and validates user-configured JSON environment files.
 * Testing environments may not have these files set up.
 *
 * @returns {object} config, devices, markers, coordinates
 */
const getEnvironment = () => {
  // const { config } = readFile('config.json');
  const config = {}; // TODO replace with env variables

  if (validator.validate(config, '/ConfigSchema').errors.length) {
    throw new FileValidationError('config');
  }

  return { config };
};

export const { config } = getEnvironment();
