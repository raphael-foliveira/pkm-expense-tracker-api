import { Repository } from 'typeorm';
import { Expense } from '../entitites/expense';
import { ExpenseRepository } from '../../service/interfaces/repository';

export class ExpenseRepositoryImpl implements ExpenseRepository {
  constructor(private repository: Repository<Expense>) {}

  save(entity: Expense) {
    return this.repository.save(entity);
  }

  findOneById(id: number) {
    return this.repository.findOne({ where: { id }, relations: ['user'] });
  }

  find(filter: Partial<Expense>) {
    return this.repository.find({ where: filter });
  }

  async delete(id: number) {
    const expense = await this.findOneById(id);
    if (!expense) return null;
    return this.repository.remove(expense);
  }
}
