import { DataSource } from 'typeorm';
import { User } from './entitites/user';
import { Expense } from './entitites/expense';
import { configService } from '../service/config';

const entities = [User, Expense];

export const dataSource = new DataSource({
  type: 'postgres',
  host: configService.database.host,
  port: configService.database.port,
  username: configService.database.user,
  password: configService.database.password,
  database: configService.database.name,
  synchronize: configService.environment.nodeEnv !== 'prod',
  entities,
});
