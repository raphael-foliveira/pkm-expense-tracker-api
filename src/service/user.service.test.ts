import { config } from 'dotenv';
config({ path: '.env.test' });

import { userFactory } from '../stubs/user';
import { mocks } from '../tests/mocks';
import { userService } from './user.service';

describe('UserService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should find a user by username', async () => {
    const createdUser = userFactory();
    mocks.userRepository('findOneByUsername', createdUser);
    const user = await userService.findByUsername(createdUser.username);

    expect(user.username).toEqual(createdUser.username);
  });

  it('should find a user by id', async () => {
    const createdUser = userFactory();
    mocks.userRepository('findOneById', createdUser);
    const foundUser = await userService.findById(createdUser.id!);

    expect(foundUser.id).toEqual(createdUser.id);
  });
});
