import { Router } from 'express';
import { AuthController } from '../controller/auth';
import { validateBody, validateHeaders } from '../middleware/validation';
import {
  AuthorizationSchema,
  LoginSchema,
  RefreshTokenSchema,
  SignupSchema,
} from '../schemas/auth';
import { useHandler } from '../helpers/handler';

export const authRoutes = (controller: AuthController) => {
  const router = Router();

  router.post(
    '/signup',
    validateBody(SignupSchema),
    useHandler((req, res, next) => controller.signup(req, res)),
  );

  router.post(
    '/login',
    validateBody(LoginSchema),
    useHandler((req, res, next) => controller.login(req, res)),
  );

  router.get(
    '/logout',
    validateHeaders(AuthorizationSchema),
    useHandler((req, res, next) => controller.logout(req, res)),
  );

  router.post(
    '/refresh-token',
    validateBody(RefreshTokenSchema),
    useHandler((req, res, next) => controller.refreshAccessToken(req, res)),
  );

  router.get(
    '/verify',
    validateHeaders(AuthorizationSchema),
    useHandler((req, res, next) => controller.verify(req, res)),
  );

  return router;
};
