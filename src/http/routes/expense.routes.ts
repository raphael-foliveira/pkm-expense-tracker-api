import { Router } from 'express';
import { useHandler } from '../helpers/handler';
import { AuthorizationSchema } from '../schemas/auth.schemas';
import { IdParamSchema } from '../schemas/common';
import { expenseController } from '../controller/expense.controller';
import validate from '../middleware/validation.middleware';
import authMiddleware from '../middleware/auth.middleware';
import {
  CreateExpenseSchema,
  GetByMonthSchema,
} from '../schemas/expense.schemas';

export const expenseRouter = Router();

expenseRouter
  .route('/')
  .get(useHandler(expenseController.find))
  .post(
    validate.headers(AuthorizationSchema),
    validate.body(CreateExpenseSchema),
    authMiddleware.checkToken,
    useHandler(expenseController.create),
  );

expenseRouter
  .route('/:id')
  .all(validate.params(IdParamSchema))
  .get(useHandler(expenseController.findOne))
  .delete(
    validate.headers(AuthorizationSchema),
    authMiddleware.checkToken,
    useHandler(expenseController.remove),
  );

expenseRouter
  .route('/month/:month/:year')
  .get(
    validate.params(GetByMonthSchema),
    useHandler(expenseController.getByMonth),
  );
