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
  username: get('POSTGRES_USER'),
  password: get('POSTGRES_PASSWORD'),
  database: get('POSTGRES_DB'),
  host: get('POSTGRES_HOST'),
  port: parseInt(get('POSTGRES_PORT')),
};

const secrets = {
  accessToken: get('ACCESS_TOKEN_SECRET'),
  refreshToken: get('REFRESH_TOKEN_SECRET'),
};

const isProductionEnvironment = () => environment.nodeEnv === 'production';

export const config = {
  get,
  isProductionEnvironment,
  environment,
  database,
  secrets,
};
