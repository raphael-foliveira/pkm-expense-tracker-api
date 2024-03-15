const get = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    return '';
  }
  return value;
};

const environment = {
  nodeEnv: get('NODE_ENV'),
};

const database = {
  user: get('POSTGRES_USER'),
  password: get('POSTGRES_PASSWORD'),
  name: get('POSTGRES_DB'),
  host: get('POSTGRES_HOST'),
  port: parseInt(get('POSTGRES_PORT')),
};

const secrets = {
  accessToken: get('ACCESS_TOKEN_SECRET'),
  refreshToken: get('REFRESH_TOKEN_SECRET'),
};

export default { get, environment, database, secrets };
