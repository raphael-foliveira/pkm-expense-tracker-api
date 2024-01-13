import { Request, Response } from 'express';
import { expenseMapper } from './mappers/expense';
import { expenseService } from '../../service/expense';
import { authService } from '../../service/auth';

const create = async (
  { body, headers: { authorization } }: Request,
  res: Response,
) => {
  const { id } = await authService.verifyAccessToken(authorization!);
  const expense = await expenseService.create(body, id);
  return res.status(201).json(expenseMapper.toResponseDto(expense));
};

const find = async ({ query }: Request, res: Response) => {
  const expenses = await expenseService.find(query);
  return res.status(200).json(expenses.map(expenseMapper.toResponseDto));
};

const findOne = async ({ params: { id } }: Request, res: Response) => {
  const expense = await expenseService.findOne(+id);
  return res.status(200).json(expenseMapper.toResponseDto(expense));
};

const remove = async (
  { params: { id }, headers: { authorization } }: Request,
  res: Response,
) => {
  const user = await authService.verifyAccessToken(authorization!);
  await expenseService.remove(+id, user.id);
  return res.status(204).send();
};

const getByMonth = async (
  { params: { month, year } }: Request,
  res: Response,
) => {
  const expenses = await expenseService.getByMonth({
    month: +month,
    year: +year,
  });
  return res.status(200).json(expenses.map(expenseMapper.toResponseDto));
};

export const expenseController = {
  create,
  find,
  findOne,
  remove,
  getByMonth,
};
