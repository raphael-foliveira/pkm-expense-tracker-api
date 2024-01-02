import { Router } from 'express';
import { healthCheckController } from '../controller/healthcheck';
import { useHandler } from '../helpers/handler';

export const healthcheckRouter = Router();

healthcheckRouter.route('/').get(useHandler(healthCheckController.get));
