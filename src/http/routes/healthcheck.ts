import { Router } from 'express';
import { HealthCheckController } from '../controller/healthcheck';
import { useHandler } from '../helpers/handler';

export const healthcheckRoutes = (controller: HealthCheckController) => {
  const router = Router();

  router
    .route('/')
    .get(useHandler((req, res, next) => controller.get(req, res)));

  return router;
};
