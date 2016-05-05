#!/usr/bin/env node

/* eslint no-console:0 */
/* globals console */

const cluster = require('cluster');

// Enable ES6 import/export syntax on all server files but this one
require('babel-core/register');

// Start server with config
require('./server/server');
require('./server/config');
