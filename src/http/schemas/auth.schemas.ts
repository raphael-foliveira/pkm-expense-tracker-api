import { z } from 'zod';

export const LoginSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export const SignupSchema = z.object({
  email: z.string().email('Por favor insira um email válido'),
  username: z.string(),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
  firstName: z.string(),
  lastName: z.string(),
});

export const BearerTokenSchema = z
  .string()
  .refine((value) => {
    return value.startsWith('Bearer ');
  }, "Authorization header must start with 'Bearer '")
  .transform((value) => value.split(' ')[1]);

export const AuthorizationSchema = z.object({
  authorization: BearerTokenSchema,
});

export const RefreshTokenSchema = z.object({
  refreshToken: BearerTokenSchema,
});
