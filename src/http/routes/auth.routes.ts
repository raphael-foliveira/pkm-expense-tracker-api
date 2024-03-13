import { Router } from 'express';
import { authController } from '../controller/auth.controller';
import { useHandler } from '../helpers/handler';
import {
  ApiKeySchema,
  AuthorizationSchema,
  LoginSchema,
  RefreshTokenSchema,
  SignupSchema,
} from '../schemas/auth.schemas';
import validate from '../middleware/validation.middleware';
import { IdParamSchema } from '../schemas/common';

export const authRouter = Router();

authRouter.post(
  '/signup',
  validate.body(SignupSchema),
  useHandler(authController.signup),
);

authRouter.post(
  '/login',
  validate.body(LoginSchema),
  useHandler(authController.login),
);

authRouter.get(
  '/logout',
  validate.headers(AuthorizationSchema),
  useHandler(authController.logout),
);

authRouter.post(
  '/refresh-token',
  validate.body(RefreshTokenSchema),
  useHandler(authController.refreshAccessToken),
);

authRouter.get(
  '/verify',
  validate.headers(AuthorizationSchema),
  useHandler(authController.verify),
);

authRouter.delete(
  '/user/:id',
  validate.params(IdParamSchema),
  validate.headers(ApiKeySchema),
  useHandler(authController.deleteUser),
);
