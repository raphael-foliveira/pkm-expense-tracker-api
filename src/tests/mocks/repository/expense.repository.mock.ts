import { expenseRepository } from '../../../persistence/repository/expense.repository';

export const expenseRepositoryMock = (
  methodName: keyof typeof expenseRepository,
  resultValue: any = {},
) => {
  return jest
    .spyOn(expenseRepository, methodName)
    .mockResolvedValue(resultValue);
};
