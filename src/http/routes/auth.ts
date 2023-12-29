import { Router } from 'express';
import { authController } from '../controller/auth';
import { useHandler } from '../helpers/handler';
import {
  AuthorizationSchema,
  LoginSchema,
  RefreshTokenSchema,
  SignupSchema,
} from '../schemas/auth';
import { validate } from '../middleware/validation';

export const authRoutes = () => {
  const router = Router();

  router.post(
    '/signup',
    validate.body(SignupSchema),
    useHandler(authController.signup),
  );

  router.post(
    '/login',
    validate.body(LoginSchema),
    useHandler(authController.login),
  );

  router.get(
    '/logout',
    validate.headers(AuthorizationSchema),
    useHandler(authController.logout),
  );

  router.post(
    '/refresh-token',
    validate.body(RefreshTokenSchema),
    useHandler(authController.refreshAccessToken),
  );

  router.get(
    '/verify',
    validate.headers(AuthorizationSchema),
    useHandler(authController.verify),
  );

  return router;
};
