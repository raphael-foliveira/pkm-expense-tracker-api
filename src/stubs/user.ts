import { faker } from '@faker-js/faker';
import { User } from '../persistence/entitites/user';

export const userFactory = (): User => {
  return {
    id: faker.number.int(),
    username: faker.internet.userName(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    refreshToken: faker.string.uuid(),
    expenses: [],
  };
};
