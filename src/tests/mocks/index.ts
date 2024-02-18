import { expenseRepositoryMock, userRepositoryMock } from './repository';
import { jwtServiceMock } from './service';

export const mocks = {
  userRepository: userRepositoryMock,
  expenseRepository: expenseRepositoryMock,
  jwtService: jwtServiceMock,
};
