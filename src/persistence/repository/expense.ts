import { dataSource } from '../data-source';
import { Expense } from '../entitites/expense';

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

export const expenseRepository = {
  save,
  findOneById,
  find,
  remove,
};
