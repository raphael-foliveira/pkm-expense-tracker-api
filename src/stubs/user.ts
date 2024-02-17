import { faker } from '@faker-js/faker';
import { User } from '../persistence/entitites/user';
import { hashSync } from 'bcryptjs';

export const userFactory = (): User => {
  const password = hashSync(faker.internet.password(), 10);
  return {
    id: faker.number.int({ max: 1000 }),
    username: faker.internet.userName(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    password,
    refreshToken: faker.string.uuid(),
    expenses: [],
  };
};
