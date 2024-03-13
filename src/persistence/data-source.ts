import { DataSource } from 'typeorm';
import { User } from './entitites/user';
import { Expense } from './entitites/expense';
import config from '../service/config.service';

const entities = [User, Expense];

const dataSource = new DataSource({
  type: 'postgres',
  host: config.database.host,
  port: config.database.port,
  username: config.database.user,
  password: config.database.password,
  database: config.database.name,
  synchronize: config.environment.nodeEnv !== 'prod',
  entities,
});

export default dataSource;
