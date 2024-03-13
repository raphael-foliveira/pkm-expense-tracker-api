import { Repository } from 'typeorm';
import { User } from '../entitites/user';
import { BaseRepository } from './base.repository';
import { dataSource } from '../data-source';

class UserRepository extends BaseRepository<User> {
  constructor(repository: Repository<User>) {
    super(repository);
  }
  findOneByEmail(email: string) {
    return this.repository.findOne({ where: { email } });
  }

  findOneByUsername(username: string) {
    return this.repository.findOne({ where: { username } });
  }
}

export const userRepository = new UserRepository(
  dataSource.getRepository(User),
);
