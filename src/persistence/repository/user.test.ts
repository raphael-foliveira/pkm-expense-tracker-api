import { config } from 'dotenv';
config({ path: '.env.test' });

import { userFactory } from '../../stubs/user';
import { dataSource } from '../data-source';
import { userRepository } from './user';
import { User } from '../entitites/user';

describe('UserRepository', () => {
  beforeAll(async () => {
    await dataSource.initialize();
  });

  afterAll(async () => {
    await dataSource.destroy();
  });
  it('should delete a user', async () => {
    await dataSource.getRepository(User).remove(await userRepository.find({}));
    const createdUser = await userRepository.save(await userFactory());
    const deletedUser = await userRepository.remove(createdUser.id!);
    const foundUsers = await userRepository.find({});

    expect(deletedUser!.id).toEqual(createdUser.id);
    expect(foundUsers).toHaveLength(0);
  });
});
