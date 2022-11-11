# node-secrets-manager
Node package for secrets-manager

## Configure
Secrets-manager uses `secrets.json` to configure how it handles secrets. Here is example of secrets.json file together with explaination of each option:

```json
{
  "app": {
    "id": "$environment/app",
    "input": "json",
    "type": "env",
    "path": "config/application.yml"
  },
  "tmp_file_secret": {
    "id": "production/tmp_secret",
    "input": "plaintext",
    "type": "file",
    "path": "tmp/tmp_secret.txt"
  }
}
```

#### ID
Represents secret_id used to retrieve secret from AWS Secret Manager.

It is possible to provide `$environment` which will be interpolated from env variable `APP_ENV` or `development` by default

#### INPUT
Defines format of secret coming from AWS Secret Manager. Two possible values: `json` and `plaintext`.

If specified as `json`, secret will be parsed in KEY-VALUE format.

If specified as `plaintext`, secret will be treated as string.

#### TYPE
Defines type of injection during boot. Two possible values: `env` and `file`.

If specified as `env`, secret will be injected into env variables during boot.

#### PATH
Defines path where secrets will be pulled.

## Authorization
Use same authorization process as AWS-CLI:
https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html

### PULL
Pull secrets locally:
```
aws-vault exec <username> -- npx secrets-pull
```
Options:
- environment - provided by env variable `APP_ENV` or `development` by default
- config - provided by env variable `SECRETS_CONFIG` or `secrets.json` by default
