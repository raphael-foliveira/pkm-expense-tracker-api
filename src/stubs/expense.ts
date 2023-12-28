import { faker } from '@faker-js/faker';
import { CreateExpenseDto } from '../service/dto/expense';

export const createExpenseDtoFactory = (): CreateExpenseDto => {
  return {
    price: +faker.number.float().toFixed(2),
    description: faker.lorem.sentence(),
    date: faker.date.past(),
  };
};
