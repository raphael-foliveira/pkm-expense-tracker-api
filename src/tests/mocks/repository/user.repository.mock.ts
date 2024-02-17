import { userRepository } from '../../../persistence/repository/user';

export const userRepositoryMock = (
  methodName: keyof typeof userRepository,
  resultValue: any = {},
) => {
  return jest.spyOn(userRepository, methodName).mockResolvedValue(resultValue);
};
