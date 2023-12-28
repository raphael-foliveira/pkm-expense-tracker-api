import { Router } from 'express';
import { ExpenseController } from '../controller/expense';
import {
  validateBody,
  validateHeaders,
  validateParams,
} from '../middleware/validation';
import { CreateExpenseSchema } from '../schemas/expense';
import { useHandler } from '../helpers/handler';
import { AuthorizationSchema } from '../schemas/auth';
import { IdParamSchema } from '../schemas/common';

export const expenseRoutes = (controller: ExpenseController) => {
  const router = Router();

  router
    .route('/')
    .get(useHandler((req, res, next) => controller.find(req, res)))
    .post(
      validateHeaders(AuthorizationSchema),
      validateBody(CreateExpenseSchema),
      useHandler((req, res, next) => controller.create(req, res)),
    );

  router
    .route('/:id')
    .all(validateParams(IdParamSchema))
    .get(useHandler((req, res, next) => controller.findOne(req, res)))
    .delete(
      validateHeaders(AuthorizationSchema),
      useHandler((req, res, next) => controller.delete(req, res)),
    );

  return router;
};
