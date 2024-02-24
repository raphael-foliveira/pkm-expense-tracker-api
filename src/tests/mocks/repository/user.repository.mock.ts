import { userRepository } from '../../../persistence/repository/user.repository';

export const userRepositoryMock = (
  methodName: keyof typeof userRepository,
  resultValue: any = {},
) => {
  return jest.spyOn(userRepository, methodName).mockResolvedValue(resultValue);
};
