import { Router } from 'express';
import { authController } from '../controller/auth';
import { useHandler } from '../helpers/handler';
import { validateBody, validateHeaders } from '../middleware/validation';
import {
  AuthorizationSchema,
  LoginSchema,
  RefreshTokenSchema,
  SignupSchema,
} from '../schemas/auth';

export const authRoutes = () => {
  const router = Router();

  router.post(
    '/signup',
    validateBody(SignupSchema),
    useHandler(authController.signup),
  );

  router.post(
    '/login',
    validateBody(LoginSchema),
    useHandler(authController.login),
  );

  router.get(
    '/logout',
    validateHeaders(AuthorizationSchema),
    useHandler(authController.logout),
  );

  router.post(
    '/refresh-token',
    validateBody(RefreshTokenSchema),
    useHandler(authController.refreshAccessToken),
  );

  router.get(
    '/verify',
    validateHeaders(AuthorizationSchema),
    useHandler(authController.verify),
  );

  return router;
};
