import { Repository } from 'typeorm';
import { Expense } from '../entitites/expense';
import { ExpenseRepository } from '../../service/interfaces/repository';

export class ExpenseRepositoryImpl implements ExpenseRepository {
  constructor(private repository: Repository<Expense>) {}

  save(entity: Expense) {
    return this.repository.save(entity);
  }

  findOneById(id: number) {
    return this.repository.findOne({ where: { id } });
  }

  find(filter: Partial<Expense>) {
    return this.repository.find({ where: filter });
  }

  async delete(id: number) {
    const user = await this.findOneById(id);
    if (!user) return null;
    await this.repository.delete(id);
    return user;
  }
}
