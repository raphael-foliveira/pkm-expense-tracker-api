import { GetByMonthProps } from '../../service/expense';
import { dataSource } from '../data-source';
import { Expense } from '../entitites/expense';
import datefns from 'date-fns';

export const repository = dataSource.getRepository(Expense);

const save = (entity: Expense) => {
  return repository.save(entity);
};

const findOneById = (id: number) => {
  return repository.findOne({ where: { id }, relations: ['user'] });
};

const find = (filter: Partial<Expense>) => {
  return repository.find({ where: filter });
};

const remove = async (id: number) => {
  const expense = await findOneById(id);
  if (!expense) return null;
  return repository.remove(expense);
};

const getByMonth = async ({ month, year }: GetByMonthProps) => {
  const rangeStart = datefns.startOfMonth(new Date(year, month - 1));
  const rangeEnd = datefns.addMonths(rangeStart, 1);
  return repository
    .createQueryBuilder('expense')
    .where('expense.date > :rangeStart AND expense.date < :rangeEnd', {
      rangeStart,
      rangeEnd,
      month,
    })
    .innerJoinAndSelect('expense.user', 'user')
    .getMany();
};

export const expenseRepository = {
  save,
  findOneById,
  find,
  remove,
  getByMonth,
};
