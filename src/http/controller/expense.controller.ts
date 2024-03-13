import { RequestHandler } from 'express';
import authService from '../../service/auth.service';
import expenseService from '../../service/expense.service';
import { expenseMapper } from './mappers/expense.mapper';

const create: RequestHandler = async (
  { body, headers: { authorization } },
  res,
) => {
  const { id } = await authService.verifyAccessToken(authorization!);
  const expense = await expenseService.create(body, id!);
  return res.status(201).json(expenseMapper.toResponseDto(expense));
};

const find: RequestHandler = async ({ query }, res) => {
  const expenses = await expenseService.find(query);
  return res.status(200).json(expenses.map(expenseMapper.toResponseDto));
};

const findOne: RequestHandler = async ({ params: { id } }, res) => {
  const expense = await expenseService.findOne(+id);
  return res.status(200).json(expenseMapper.toResponseDto(expense));
};

const remove: RequestHandler = async (
  { params: { id }, headers: { authorization } },
  res,
) => {
  const user = await authService.verifyAccessToken(authorization!);
  await expenseService.remove(+id, user.id!);
  return res.status(204).send();
};

const getByMonth: RequestHandler = async ({ params: { month, year } }, res) => {
  const expenses = await expenseService.getByMonth({
    month: +month,
    year: +year,
  });
  const mappedExpenses = expenses.map(expenseMapper.toResponseDto);
  return res.status(200).json(mappedExpenses);
};

export const expenseController = {
  create,
  find,
  findOne,
  remove,
  getByMonth,
};
