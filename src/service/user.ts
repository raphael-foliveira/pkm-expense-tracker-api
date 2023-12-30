import { User } from '../persistence/entitites/user';
import { userRepository } from '../persistence/repository/user';
import { NotFoundError } from './errors/common';

const findByEmail = async (email: string) => {
  const user = await userRepository.findOneByEmail(email);
  if (!user) {
    throw new NotFoundError('User not found');
  }
  return user as Required<User>;
};

const findByUsername = async (username: string) => {
  const user = await userRepository.findOneByUsername(username);
  if (!user) {
    throw new NotFoundError('User not found');
  }
  return user;
};

const findById = async (id: number) => {
  const user = await userRepository.findOneById(id);
  if (!user) {
    throw new NotFoundError('User not found');
  }
  return user as Required<User>;
};

export const userService = {
  findByEmail,
  findByUsername,
  findById,
};
