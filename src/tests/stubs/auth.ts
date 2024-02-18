import { faker } from '@faker-js/faker';
import { SignupDto } from '../../service/dto/auth';

export const signupDtoFactory = (): SignupDto => {
  return {
    email: faker.internet.email(),
    username: faker.internet.userName(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    password: faker.internet.password(),
  };
};
