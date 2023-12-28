import { Router } from 'express';
import { UserController } from '../controller/user';

export const userRoutes = (controller: UserController) => {
  const router = Router();
  return router;
};
