import { Request, Response } from 'express';
import { ExpenseService } from '../../service/expense';
import { AuthService } from '../../service/auth';
import { ExpenseMapper } from './mappers/expense';

export class ExpenseController {
  constructor(
    private expenseService: ExpenseService,
    private authService: AuthService,
  ) {}

  async create(
    { body, headers: { authorization = '' } }: Request,
    res: Response,
  ) {
    const { id } = await this.authService.verifyAccessToken(authorization);
    const expense = await this.expenseService.create(body, id);
    return res.status(201).json(ExpenseMapper.toResponseDto(expense));
  }

  async find({ query }: Request, res: Response) {
    const expenses = await this.expenseService.find(query);
    return res.status(200).json(expenses.map(ExpenseMapper.toResponseDto));
  }

  async findOne({ params: { id = '0' } }: Request, res: Response) {
    const expense = await this.expenseService.findOne(+id);
    return res.status(200).json(ExpenseMapper.toResponseDto(expense));
  }

  async delete(
    { params: { id = '0' }, headers: { authorization = '' } }: Request,
    res: Response,
  ) {
    const user = await this.authService.verifyAccessToken(authorization);
    await this.expenseService.delete(+id, user.id);
    return res.status(204).send();
  }
}
