import { Router } from 'express';
import { CreateExpenseSchema, GetByMonthSchema } from '../schemas/expense';
import { useHandler } from '../helpers/handler';
import { AuthorizationSchema } from '../schemas/auth';
import { IdParamSchema } from '../schemas/common';
import { expenseController } from '../controller/expense';
import { validate } from '../middleware/validation';

export const expenseRouter = Router();

expenseRouter
  .route('/')
  .get(useHandler(expenseController.find))
  .post(
    validate.headers(AuthorizationSchema),
    validate.body(CreateExpenseSchema),
    useHandler(expenseController.create),
  );

expenseRouter
  .route('/:id')
  .all(validate.params(IdParamSchema))
  .get(useHandler(expenseController.findOne))
  .delete(
    validate.headers(AuthorizationSchema),
    useHandler(expenseController.remove),
  );

expenseRouter
  .route('/month/:month/:year')
  .get(
    validate.params(GetByMonthSchema),
    useHandler(expenseController.getByMonth),
  );
