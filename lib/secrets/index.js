const Client = require('./client.js');
const Config = require('./config.js');
const YAML = require('yaml');
const fs = require('fs');


async function pullToFiles(configFile, environment) {
  const client = new Client();
  const config = new Config(configFile);

  for (const secret of config.secrets) {
    const data = await secretOutput(client, environment, secret);
    if (!data) {
      console.log('No data for secret found');
      continue;
    }
    console.log(`Writing secrets to ${secret.path}`);
    fs.writeFileSync(secret.path, data)
  }
}

function addToEnv(configFile) {
  const config = new Config(configFile);
  config.secrets.filter(s => s.writeToEnv() && !s.isPlaintext()).forEach(s => addSecretToEnv(s));
}

function addSecretToEnv(secret) {
  console.log(`Adding secrets to env from ${secret.path}`);
  const content = fs.readFileSync(secret.path, 'utf-8');
  let data;

  if (secret.isYamlOutput()) {
    data = YAML.parse(content);
  } else {
    data = JSON.parse(content);
  }

  for (const [key, value] of Object.entries(data)) {
    process.env[key] = value;
  }
}

async function secretOutput(client, environment, secret) {
  const secretId = secret.id.replaceAll('$environment', environment)
  console.log(`Adding secrets from ${secretId}`);

  if (secret.isPlaintext()) {
    return await client.secretString(secretId);
  }

  const data = await client.secretJson(secretId);

  if (!data) {
    return;
  }

  if (secret.isYamlOutput()) {
    const doc = new YAML.Document();
    doc.contents = data;

    return doc.toString();
  }

  return JSON.stringify(data, null, 2);
}

module.exports = {
  pullToFiles,
  addToEnv
}
