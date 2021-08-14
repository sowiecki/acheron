#!/usr/bin/env node

require('dotenv').config();

// Enable ES6 import/export syntax on all server files but this one
require('babel-core/register');

// Load configuration
require('./server/config');

// Run sserver
require('./server/server');
