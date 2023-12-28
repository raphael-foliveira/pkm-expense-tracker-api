import { Expense } from '../persistence/entitites/expense';
import { CreateExpenseDto, UpdateExpenseDto } from './dto/expense';
import { NotFoundError } from './errors/common';
import { ExpenseRepository, UserRepository } from './interfaces/repository';

export class ExpenseService {
  constructor(
    private expenseRepository: ExpenseRepository,
    private userRepository: UserRepository,
  ) {}

  async create(expense: CreateExpenseDto, userId: number) {
    const user = await this.findUserById(userId);
    return this.expenseRepository.save({
      ...expense,
      user,
    });
  }

  async update(id: number, expense: UpdateExpenseDto) {
    const expenseToUpdate = await this.expenseRepository.findOneById(id);
    if (!expenseToUpdate) {
      throw new NotFoundError('Expense not found');
    }
    return this.expenseRepository.save({
      ...expenseToUpdate,
      ...expense,
    });
  }

  async findOne(id: number) {
    const expense = await this.expenseRepository.findOneById(id);
    if (!expense) {
      throw new NotFoundError('Expense not found');
    }
    return expense;
  }

  async find(filter: Partial<Expense>) {
    return this.expenseRepository.find(filter);
  }

  async delete(id: number) {
    return this.expenseRepository.delete(id);
  }

  private async findUserById(id: number) {
    const user = await this.userRepository.findOneById(id);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return user;
  }
}
