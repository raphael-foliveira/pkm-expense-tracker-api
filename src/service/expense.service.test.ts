import { mocks } from '../tests/mocks';
import { expenseFactory } from '../tests/stubs/expense';
import { expenseService } from './expense.service';

describe('expenseService', () => {
  describe('update', () => {
    it('should update an expense', async () => {
      const expense = expenseFactory();
      const updatedExpense = { ...expense, price: 100 };
      mocks.expenseRepository('findOneById', expense);
      mocks.expenseRepository('save', updatedExpense);
      const updated = await expenseService.update(expense.id!, {
        date: expense.date,
        price: updatedExpense.price,
        description: expense.description,
      });
      expect(updated).toEqual(updatedExpense);
    });
  });
});
