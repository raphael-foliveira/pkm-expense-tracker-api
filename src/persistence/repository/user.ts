import { dataSource } from '../data-source';
import { User } from '../entitites/user';

const repository = dataSource.getRepository(User);

const findOneByEmail = (email: string) => {
  return repository.findOne({ where: { email } });
};

const findOneByUsername = (username: string) => {
  return repository.findOne({ where: { username } });
};

const save = (entity: User) => {
  return repository.save(entity);
};

const findOneById = (id: number) => {
  return repository.findOne({ where: { id } });
};

const find = (filter: Partial<User>) => {
  return repository.find({ where: filter });
};

const remove = async (id: number) => {
  const user = await findOneById(id);
  if (!user) return null;
  await repository.delete(id);
  return user;
};

export const userRepository = {
  findOneByEmail,
  findOneByUsername,
  save,
  findOneById,
  find,
  remove,
};
