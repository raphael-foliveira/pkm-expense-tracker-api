import { Router } from 'express';
import {
  validateBody,
  validateHeaders,
  validateParams,
} from '../middleware/validation';
import { CreateExpenseSchema } from '../schemas/expense';
import { useHandler } from '../helpers/handler';
import { AuthorizationSchema } from '../schemas/auth';
import { IdParamSchema } from '../schemas/common';
import { expenseController } from '../controller/expense';

export const expenseRoutes = () => {
  const router = Router();

  router
    .route('/')
    .get(useHandler(expenseController.find))
    .post(
      validateHeaders(AuthorizationSchema),
      validateBody(CreateExpenseSchema),
      useHandler(expenseController.create),
    );

  router
    .route('/:id')
    .all(validateParams(IdParamSchema))
    .get(useHandler(expenseController.findOne))
    .delete(
      validateHeaders(AuthorizationSchema),
      useHandler(expenseController.remove),
    );

  return router;
};
