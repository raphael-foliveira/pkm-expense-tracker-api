import { expenseRepository } from '../../../persistence/repository/expense';

export const mockExpenseRepository = () => {
  for (const key of Object.keys(expenseRepository)) {
    expenseRepository[key as keyof typeof expenseRepository] = jest.fn();
  }
};
export const expenseRepositoryMock = (
  methodName: keyof typeof expenseRepository,
  resultValue: any = {},
) => {
  return jest
    .spyOn(expenseRepository, methodName)
    .mockResolvedValue(resultValue);
};
