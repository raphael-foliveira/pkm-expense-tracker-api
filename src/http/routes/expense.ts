import { Router } from 'express';
import { CreateExpenseSchema } from '../schemas/expense';
import { useHandler } from '../helpers/handler';
import { AuthorizationSchema } from '../schemas/auth';
import { IdParamSchema } from '../schemas/common';
import { expenseController } from '../controller/expense';
import { validate } from '../middleware/validation';

export const expenseRoutes = () => {
  const router = Router();

  router
    .route('/')
    .get(useHandler(expenseController.find))
    .post(
      validate.headers(AuthorizationSchema),
      validate.body(CreateExpenseSchema),
      useHandler(expenseController.create),
    );

  router
    .route('/:id')
    .all(validate.params(IdParamSchema))
    .get(useHandler(expenseController.findOne))
    .delete(
      validate.headers(AuthorizationSchema),
      useHandler(expenseController.remove),
    );

  return router;
};
