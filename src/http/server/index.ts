import cors from 'cors';
import express from 'express';
import { dataSource } from '../../persistence/data-source';
import { errorHandlingMiddleware } from '../middleware/error-handling';
import { authRoutes } from '../routes/auth';
import { expenseRoutes } from '../routes/expense';
import { healthcheckRoutes } from '../routes/healthcheck';

export const getApp = () => {
  const app = express();

  app.use(express.json());
  app.use(cors());

  app.use('/healthcheck', healthcheckRoutes());
  app.use('/auth', authRoutes());
  app.use('/expenses', expenseRoutes());

  app.use(errorHandlingMiddleware);
  return app;
};

export const startServer = async () => {
  await dataSource.initialize();
  return getApp().listen(3000, () => {
    console.log('listening on port 3000');
  });
};
