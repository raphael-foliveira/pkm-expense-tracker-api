import { DataSource } from 'typeorm';
import { User } from './entitites/user';
import { Expense } from './entitites/expense';

const entities = [User, Expense];

export const dataSource = new DataSource({
  type: 'postgres',
  host: process.env['POSTGRES_HOST'],
  port: parseInt(process.env['POSTGRES_PORT'] as string),
  username: process.env['POSTGRES_USER'],
  password: process.env['POSTGRES_PASSWORD'],
  database: process.env['POSTGRES_DB'],
  synchronize: process.env['NODE_ENV'] !== 'prod',
  entities,
});
