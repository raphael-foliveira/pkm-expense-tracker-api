import datefns from 'date-fns';
import { FindOneOptions, Repository } from 'typeorm';
import { GetByMonthProps } from '../../service/expense.service';
import dataSource from '../data-source';
import { Expense } from '../entitites/expense';
import { BaseRepository } from './base.repository';

class ExpenseRepository extends BaseRepository<Expense> {
  constructor(repository: Repository<Expense>) {
    super(repository);
  }

  findOneById(id: number) {
    return this.repository.findOne({
      where: { id },
      relations: ['user'],
    } as FindOneOptions);
  }

  async getByMonth({ month, year }: GetByMonthProps) {
    const rangeStart = datefns.startOfMonth(new Date(year, month - 1));
    const rangeEnd = datefns.addMonths(rangeStart, 1);
    return this.repository
      .createQueryBuilder('expense')
      .where('expense.date > :rangeStart AND expense.date < :rangeEnd', {
        rangeStart,
        rangeEnd,
      })
      .innerJoinAndSelect('expense.user', 'user')
      .getMany();
  }
}

export const expenseRepository = new ExpenseRepository(
  dataSource.getRepository(Expense),
);
