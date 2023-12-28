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
  database: 'postgres',
  synchronize: process.env['NODE_ENV'] === 'development',
  entities,
});

export const testDataSource = new DataSource({
  type: 'better-sqlite3',
  database: ':memory:',
  synchronize: true,
  entities,
});
