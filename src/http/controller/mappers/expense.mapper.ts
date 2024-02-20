import { Expense } from '../../../persistence/entitites/expense';
import { userMapper, UserResponseDto } from './user.mapper';

export interface ExpenseResponseDto {
  id: number;
  price: number;
  description: string;
  date: Date;
  createdAt: Date;
  createdBy?: UserResponseDto;
}

const toResponseDto = ({
  id = 0,
  price,
  description,
  date,
  createdAt = new Date(0),
  user,
}: Expense): ExpenseResponseDto => {
  const dto: ExpenseResponseDto = {
    id,
    price,
    description,
    date,
    createdAt,
  };
  if (user) {
    dto.createdBy = userMapper.toResponseDto(user);
  }
  return dto;
};

export const expenseMapper = {
  toResponseDto,
};
