import { expenseRepository } from '../../../persistence/repository/expense';

export const expenseRepositoryMock = (
  methodName: keyof typeof expenseRepository,
  resultValue: any = {},
) => {
  return jest
    .spyOn(expenseRepository, methodName)
    .mockResolvedValue(resultValue);
};
