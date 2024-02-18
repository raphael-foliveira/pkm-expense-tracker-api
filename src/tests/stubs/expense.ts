import { faker } from '@faker-js/faker';
import { CreateExpenseDto } from '../service/dto/expense';
import { Expense } from '../persistence/entitites/expense';

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
