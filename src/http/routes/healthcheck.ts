import { Router } from 'express';
import { healthCheckController } from '../controller/healthcheck';
import { useHandler } from '../helpers/handler';

export const healthcheckRoutes = () => {
  const router = Router({ strict: false });

  router.route('/').get(useHandler(healthCheckController.get));

  return router;
};
