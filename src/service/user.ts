import { User } from '../persistence/entitites/user';
import { UserRepository } from './interfaces/repository';

export class UserService {
  constructor(private userRepository: UserRepository) {}

  find(filter: Partial<User>) {
    return this.userRepository.find(filter);
  }

  findOne(id: number) {
    return this.userRepository.findOneById(id);
  }

  findOneByEmail(email: string) {
    return this.userRepository.findOneByEmail(email);
  }

  delete(id: number) {
    return this.userRepository.delete(id);
  }
}
