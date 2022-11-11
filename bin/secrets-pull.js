#!/usr/bin/env node
const secrets = require('../lib/secrets/index.js')

const env = process.env.APP_ENV || 'development';
const config = process.env.SECRETS_CONFIG || 'secrets.json';

secrets.pullToFiles(config, env);

