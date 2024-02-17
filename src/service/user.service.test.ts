import { config } from 'dotenv';
config({ path: '.env.test' });

import { userService } from './user.service';
import { userRepository } from '../persistence/repository/user';
import { userFactory } from '../stubs/user';
import {
  mockUserRepository,
  userRepositoryMock,
} from '../tests/mocks/repository/user.repository.mock';

describe('UserService', () => {
  beforeAll(() => {
    mockUserRepository();
  });
  it('should find a user by username', async () => {
    const createdUser = userFactory();
    userRepositoryMock('findOneByUsername', createdUser);
    const user = await userService.findByUsername(createdUser.username);

    expect(user.username).toEqual(createdUser.username);
  });

  it('should find a user by id', async () => {
    const createdUser = userFactory();
    userRepositoryMock('findOneById', createdUser);
    const foundUser = await userService.findById(createdUser.id!);

    expect(foundUser.id).toEqual(createdUser.id);
  });
});
