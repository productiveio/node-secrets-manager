const secrets = require('./lib/secrets/index.js');

const env = process.env.APP_ENV;
const config = process.env.SECRETS_CONFIG || 'secrets.json';

async function init() {
  if (env && env !== 'development') {
    await secrets.pullToFiles(config, env);
  }

  secrets.addToEnv(config);
};

module.exports = { init }