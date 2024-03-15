import { Expense } from '../persistence/entitites/expense';
import { expenseRepository } from '../persistence/repository/expense.repository';
import { userRepository } from '../persistence/repository/user.repository';
import { CreateExpenseDto, UpdateExpenseDto } from './dto/expense';
import { ForbiddenError, NotFoundError } from './errors/common';

const create = async (expense: CreateExpenseDto, userId: number) => {
  const user = await findUserById(userId);
  return expenseRepository.save({
    ...expense,
    user,
  });
};

const update = async (id: number, expense: UpdateExpenseDto) => {
  const expenseToUpdate = await expenseRepository.findOneById(id);
  if (!expenseToUpdate) {
    throw new NotFoundError('Expense not found');
  }
  return expenseRepository.save({
    ...expenseToUpdate,
    ...expense,
  });
};

const findOne = async (id: number) => {
  const expense = await expenseRepository.findOneByIdWithUser(id);
  if (!expense) {
    throw new NotFoundError('Expense not found');
  }
  return expense;
};

const find = (filter: Partial<Expense>) => {
  return expenseRepository.find(filter);
};

const remove = async (id: number, userId: number) => {
  const expenseToDelete = await findOne(id);
  if (expenseToDelete.user?.id !== userId) {
    throw new ForbiddenError('This expense does not belong to this user');
  }
  return expenseRepository.remove(id);
};

const findUserById = async (id: number) => {
  const user = await userRepository.findOneById(id);
  if (!user) {
    throw new NotFoundError('User not found');
  }
  return user;
};

export type GetByMonthProps = {
  month: number;
  year: number;
};

const getByMonth = async (getByMonthProps: GetByMonthProps) => {
  return expenseRepository.getByMonth(getByMonthProps);
};

export default { create, update, findOne, find, remove, getByMonth };
