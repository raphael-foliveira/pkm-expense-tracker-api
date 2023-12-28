import express from 'express';
import { DataSource } from 'typeorm';
import { DIContainer } from '../../di/container';
import { dataSource } from '../../persistence/data-source';
import { errorHandlingMiddleware } from '../middleware/error-handling';
import { healthcheckRoutes } from '../routes/healthcheck';
import { authRoutes } from '../routes/auth';
import { expenseRoutes } from '../routes/expense';
import { userRoutes } from '../routes/user';

export const getApp = (dataSource: DataSource) => {
  const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;
  const container = DIContainer.getInstance(dataSource, {
    accessTokenSecret: ACCESS_TOKEN_SECRET!,
    refreshTokenSecret: REFRESH_TOKEN_SECRET!,
  });

  const controllers = {
    healthCheck: container.resolveHealthCheckController(),
    auth: container.resolveAuthController(),
    user: container.resolveUserController(),
    expense: container.resolveExpenseController(),
  };

  const routes = {
    healthcheck: healthcheckRoutes(controllers.healthCheck),
    auth: authRoutes(controllers.auth),
    user: userRoutes(controllers.user),
    expense: expenseRoutes(controllers.expense),
  };

  const app = express();

  app.use(express.json());

  app.use('/healthcheck', routes.healthcheck);
  app.use('/auth', routes.auth);
  app.use('/users', routes.user);
  app.use('/expenses', routes.expense);

  app.use(errorHandlingMiddleware);
  return app;
};

export const startServer = async () => {
  await dataSource.initialize();
  return getApp(dataSource).listen(3000, () => {
    console.log('listening on port 3000');
  });
};
