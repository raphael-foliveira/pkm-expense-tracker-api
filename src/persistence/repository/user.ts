import { Repository } from 'typeorm';
import { User } from '../entitites/user';
import { UserRepository } from '../../service/interfaces/repository';

export class UserRepositoryImpl implements UserRepository {
  constructor(private repository: Repository<User>) {}

  findOneByEmail(email: string) {
    return this.repository.findOne({ where: { email } });
  }

  findOneByUsername(username: string) {
    return this.repository.findOne({ where: { username } });
  }

  save(entity: User) {
    return this.repository.save(entity);
  }

  findOneById(id: number) {
    return this.repository.findOne({ where: { id } });
  }

  find(filter: Partial<User>) {
    return this.repository.find({ where: filter });
  }

  async delete(id: number) {
    const user = await this.findOneById(id);
    if (!user) return null;
    await this.repository.delete(id);
    return user;
  }
}
