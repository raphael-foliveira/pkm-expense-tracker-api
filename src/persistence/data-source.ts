import { DataSource } from 'typeorm';
import { User } from './entitites/user';
import { Expense } from './entitites/expense';
import { configService } from '../service/config';

const entities = [User, Expense];

export const dataSource = new DataSource({
  type: 'postgres',
  host: configService.environment.postgresHost,
  port: configService.environment.postgresPort,
  username: configService.environment.postgresUser,
  password: configService.environment.postgresPassword,
  database: configService.environment.postgresDb,
  synchronize: configService.environment.nodeEnv !== 'prod',
  entities,
});
