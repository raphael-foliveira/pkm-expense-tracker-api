import { Expense } from '../../persistence/entitites/expense';
import { User } from '../../persistence/entitites/user';

export interface Repository<T> {
  save(entity: T): Promise<T>;
  findOneById(id: number): Promise<T | null>;
  find(filter: Partial<T>): Promise<T[]>;
  delete(id: number): Promise<T | null>;
}

export interface UserRepository extends Repository<User> {
  findOneByEmail(email: string): Promise<User | null>;
  findOneByUsername(username: string): Promise<User | null>;
}

export interface ExpenseRepository extends Repository<Expense> {}
