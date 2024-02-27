import { Request, RequestHandler, Response } from 'express';
import { userMapper } from './mappers/user.mapper';
import { authService } from '../../service/auth.service';
import { response } from './responses/responses';

const signup = async ({ body }: Request, res: Response) => {
  const tokens = await authService.signup(body);
  return res.status(201).json(tokens);
};

const login = async ({ body }: Request, res: Response) => {
  const data = await authService.login(body);
  return response.ok(res, data);
};

const logout = async (
  { headers: { authorization } }: Request,
  res: Response,
) => {
  await authService.logout(authorization!);
  return response.ok(res, { message: 'Logout successful' });
};

const refreshAccessToken = async (
  { body: { refreshToken } }: Request,
  res: Response,
) => {
  const tokens = await authService.refreshAccessToken(refreshToken);
  return response.created(res, tokens);
};

const verify: RequestHandler = async (
  { headers: { authorization } }: Request,
  res: Response,
) => {
  const user = await authService.verifyAccessToken(authorization!);
  const userResponseDto = userMapper.toResponseDto(user);
  return response.ok(res, userResponseDto);
};

export const authController = {
  signup,
  login,
  logout,
  refreshAccessToken,
  verify,
};
