import { Request, Response } from 'express';
import { expenseMapper } from './mappers/expense.mapper';
import { expenseService } from '../../service/expense.service';
import { authService } from '../../service/auth.service';
import { response } from './responses/responses';

const create = async (
  { body, headers: { authorization } }: Request,
  res: Response,
) => {
  const { id } = await authService.verifyAccessToken(authorization!);
  const expense = await expenseService.create(body, id!);
  return response.created(res, expenseMapper.toResponseDto(expense));
};

const find = async ({ query }: Request, res: Response) => {
  const expenses = await expenseService.find(query);
  return response.ok(res, expenses.map(expenseMapper.toResponseDto));
};

const findOne = async ({ params: { id } }: Request, res: Response) => {
  const expense = await expenseService.findOne(+id);
  return response.ok(res, expenseMapper.toResponseDto(expense));
};

const remove = async (
  { params: { id }, headers: { authorization } }: Request,
  res: Response,
) => {
  const user = await authService.verifyAccessToken(authorization!);
  await expenseService.remove(+id, user.id!);
  return response.noContent(res);
};

const getByMonth = async (
  { params: { month, year } }: Request,
  res: Response,
) => {
  const expenses = await expenseService.getByMonth({
    month: +month,
    year: +year,
  });
  const mappedExpenses = expenses.map(expenseMapper.toResponseDto);
  return response.ok(res, mappedExpenses);
};

export const expenseController = {
  create,
  find,
  findOne,
  remove,
  getByMonth,
};
