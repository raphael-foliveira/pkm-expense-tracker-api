import { User } from '../persistence/entitites/user';
import { userRepository } from '../persistence/repository/user';
import { NotFoundError } from './errors/common';

const findByEmail = async (email: string) => {
  const user = await userRepository.findOneByEmail(email);
  if (!user) {
    throw new NotFoundError('User not found');
  }
  return user as User & { id: number };
};

const findById = async (id: number) => {
  const user = await userRepository.findOneById(id);
  if (!user) {
    throw new NotFoundError('User not found');
  }
  return user as User & { id: number };
};

export const userService = {
  findByEmail,
  findById,
};
