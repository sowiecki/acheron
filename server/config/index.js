/* eslint no-console:0 */
/* globals console */
import path from 'path';

export const isProd = process.env.NODE_ENV === 'production';
export const isTest = process.env.NODE_ENV === 'test';

export const SERVER_PORT = process.env.PORT || 5000;

const ROOT = '../';
export const PUBLIC_PATH = path.join(__dirname, ROOT, 'public');
export const VIEWS_PATH = path.join(__dirname, ROOT, 'views');
