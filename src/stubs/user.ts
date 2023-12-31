import { faker } from '@faker-js/faker';
import { User } from '../persistence/entitites/user';
import { hash } from 'bcryptjs';

export const userFactory = async (): Promise<User> => {
  const password = await hash(faker.internet.password(), 10);
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
