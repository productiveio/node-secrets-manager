const SM = require('@aws-sdk/client-secrets-manager');

class Client {

  constructor() {
    this.client = new SM.SecretsManagerClient();
  }

  async secretString(secretId) {
    const command = new SM.GetSecretValueCommand({ 'SecretId': secretId });
    const response = await this.client.send(command);

    return response.SecretString;
  }

  async secretJson(secretId) {
    const content = await this.secretString(secretId);
    if (!content) {
      return;
    }

    return JSON.parse(content);
  }
}

module.exports = Client;

