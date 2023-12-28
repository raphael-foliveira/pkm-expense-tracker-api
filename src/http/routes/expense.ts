import { Router } from 'express';
import { ExpenseController } from '../controller/expense';
import { validateBody, validateHeaders } from '../middleware/validation';
import { CreateExpenseSchema } from '../schemas/expense';
import { useHandler } from '../helpers/handler';
import { AuthorizationSchema } from '../schemas/auth';

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

  return router;
};
