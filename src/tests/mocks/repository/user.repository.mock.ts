import { userRepository } from '../../../persistence/repository/user';

export const mockUserRepository = () => {
  for (const key of Object.keys(userRepository)) {
    userRepository[key as keyof typeof userRepository] = jest.fn();
  }
};
