import { DataSource } from 'typeorm';
import { User } from './entitites/user';
import { Expense } from './entitites/expense';
import { config } from '../service/config.service';

export const dataSource = new DataSource({
  ...config.database,
  type: 'postgres',
  synchronize: config.environment.nodeEnv !== 'prod',
  entities: [User, Expense],
});
