const fs = require('fs');

class Config {

  constructor(configPath) {
    this.configPath = configPath;
    this.secrets = [];

    this.readConfig();
  }

  readConfig() {
    let content = fs.readFileSync(this.configPath, 'utf-8');
    if (!content) {
      return;
    }

    const config = JSON.parse(content);
    for (const [key, value] of Object.entries(config)) {
      this.secrets.push(new SecretConfig(key, value.id, value.input, value.type, value.path));
    }
  }
}

class SecretConfig {

  constructor(name, id, input, type, path) {
    this.name = name;
    this.id = id;
    this.input = input;
    this.type = type;
    this.path = path;
  }

  isPlaintext() {
    return this.input == 'plaintext';
  }

  isJson() {
    return this.input == 'json';
  }

  writeToEnv() {
    return this.type == 'env';
  }

  writeToFile() {
    return this.type == 'file';
  }

  isYamlOutput() {
    return this.path.endsWith('.yml');
  }

  isJsonOutput() {
    return this.path.endsWith('.json');
  }
}

module.exports = Config
