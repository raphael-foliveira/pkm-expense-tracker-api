import { Expense } from '../../../persistence/entitites/expense';
import { UserMapper, UserResponseDto } from './user';

export interface ExpenseResponseDto {
  price: number;
  description: string;
  date: Date;
  createdAt: Date;
  user?: UserResponseDto;
}

export class ExpenseMapper {
  static toResponseDto(expense: Expense): ExpenseResponseDto {
    const dto: ExpenseResponseDto = {
      price: expense.price,
      description: expense.description,
      date: expense.date,
      createdAt: expense.createdAt!,
    };
    if (expense.user) {
      dto.user = UserMapper.toResponseDto(expense.user);
    }
    return dto;
  }
}
