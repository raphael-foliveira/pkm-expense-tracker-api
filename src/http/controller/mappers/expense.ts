import { Expense } from '../../../persistence/entitites/expense';
import { userMapper, UserResponseDto } from './user';

export interface ExpenseResponseDto {
  price: number;
  description: string;
  date: Date;
  createdAt: Date;
  user?: UserResponseDto;
}

const toResponseDto = (expense: Expense): ExpenseResponseDto => {
  const dto: ExpenseResponseDto = {
    price: expense.price,
    description: expense.description,
    date: expense.date,
    createdAt: expense.createdAt!,
  };
  if (expense.user) {
    dto.user = userMapper.toResponseDto(expense.user);
  }
  return dto;
};

export const expenseMapper = {
  toResponseDto,
};
