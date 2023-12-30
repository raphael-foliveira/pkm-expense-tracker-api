const get = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    return '';
  }
  return value;
};

const environment = {
  postgresUser: get('POSTGRES_USER'),
  postgresPassword: get('POSTGRES_PASSWORD'),
  postgresDb: get('POSTGRES_DB'),
  postgresHost: get('POSTGRES_HOST'),
  postgresPort: parseInt(get('POSTGRES_PORT')),
  accessTokenSecret: get('ACCESS_TOKEN_SECRET'),
  refreshTokenSecret: get('REFRESH_TOKEN_SECRET'),
  nodeEnv: get('NODE_ENV'),
};

export const configService = {
  get,
  environment,
};
