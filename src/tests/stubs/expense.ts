import { faker } from '@faker-js/faker';
import { Expense } from '../../persistence/entitites/expense';
import { CreateExpenseDto } from '../../service/dto/expense';

export const createExpenseDtoFactory = (): CreateExpenseDto => {
  return {
    price: +(faker.number.float() * 1000).toFixed(2),
    description: faker.lorem.sentence(),
    date: faker.date.past(),
  };
};

export const expenseFactory = (): Expense => {
  return {
    id: faker.number.int({ max: 10000 }),
    price: +(faker.number.float() * 1000).toFixed(2),
    description: faker.lorem.sentence(),
    date: faker.date.past(),
    createdAt: faker.date.recent(),
  };
};
