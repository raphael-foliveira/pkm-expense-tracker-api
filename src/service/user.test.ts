import { config } from 'dotenv';
config({ path: '.env.test' });

import { dataSource } from '../persistence/data-source';
import { signupDtoFactory } from '../stubs/auth';
import { authService } from './auth';
import { userService } from './user';
import { userRepository } from '../persistence/repository/user';
import { userFactory } from '../stubs/user';

describe('UserService', () => {
  beforeAll(async () => {
    await dataSource.initialize();
  });

  afterAll(async () => {
    await dataSource.close();
  });

  it('should find a user by username', async () => {
    const createdUser = await userRepository.save(await userFactory());
    const user = await userService.findByUsername(createdUser.username);

    expect(user.username).toEqual(createdUser.username);
  });

  it('should find a user by id', async () => {
    const createdUser = await userRepository.save(await userFactory());
    const foundUser = await userService.findById(createdUser.id!);

    expect(foundUser.id).toEqual(createdUser.id);
  });
});
