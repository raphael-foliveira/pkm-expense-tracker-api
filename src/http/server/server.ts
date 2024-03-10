import cors from 'cors';
import express from 'express';
import { dataSource } from '../../persistence/data-source';
import { errorHandlingMiddleware } from '../middleware/error-handling.middleware';
import { authRouter } from '../routes/auth.routes';
import { expenseRouter } from '../routes/expense.routes';
import { healthcheckRouter } from '../routes/healthcheck.routes';
import http from 'http';
import https from 'https';
import { config } from '../../service/config.service';

export const getApp = () => {
  const app = express();

  app.use(express.json());
  app.use(cors());
  app.use((_, res, next) => {
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
  const app = getApp();
  if (config.isProductionEnvironment()) {
    https.createServer(app).listen(443, () => {
      console.log('Secure server listening on port 443');
    });
    return;
  }
  http.createServer(app).listen(3000, () => {
    console.log('Server listening on port 3000');
  });
};
