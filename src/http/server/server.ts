import cors from 'cors';
import express from 'express';
import dataSource from '../../persistence/data-source';
import { errorHandlingMiddleware } from '../middleware/error-handling.middleware';
import { healthcheckRouter } from '../routes/healthcheck.routes';
import { authRouter } from '../routes/auth.routes';
import { expenseRouter } from '../routes/expense.routes';

export const getApp = () => {
  const app = express();

  app.use(express.json());
  app.use(cors());
  app.use((req, res, next) => {
    res.removeHeader('x-powered-by');
    return next();
  });

  app.use('/healthcheck', healthcheckRouter);
  app.use('/auth', authRouter);
  app.use('/expenses', expenseRouter);

  app.use(errorHandlingMiddleware);
  return app;
};

export const startServer = async () => {
  await dataSource.initialize();
  return getApp().listen(3000, () => {
    console.log('listening on port 3000');
  });
};
