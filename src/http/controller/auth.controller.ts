import { Request, RequestHandler, Response } from 'express';
import { userMapper } from './mappers/user.mapper';
import { authService } from '../../service/auth.service';
import { userService } from '../../service/user.service';

const signup = async ({ body }: Request, res: Response) => {
  const tokens = await authService.signup(body);
  return res.status(201).json(tokens);
};

const login = async ({ body }: Request, res: Response) => {
  const data = await authService.login(body);
  return res.status(200).json(data);
};

const logout = async (
  { headers: { authorization } }: Request,
  res: Response,
) => {
  await authService.logout(authorization!);
  return res.status(200).json({ message: 'Logout successful' });
};

const refreshAccessToken = async (
  { body: { refreshToken } }: Request,
  res: Response,
) => {
  const tokens = await authService.refreshAccessToken(refreshToken);
  return res.status(201).json(tokens);
};

const verify: RequestHandler = async (
  { headers: { authorization } }: Request,
  res: Response,
) => {
  const user = await authService.verifyAccessToken(authorization!);
  const userResponseDto = userMapper.toResponseDto(user);
  return res.status(200).json(userResponseDto);
};

const deleteUser: RequestHandler = async (
  { params: { id } }: Request,
  res: Response,
) => {
  await userService.remove(+id);
  return res.sendStatus(204);
};

export const authController = {
  signup,
  login,
  logout,
  refreshAccessToken,
  verify,
  deleteUser,
};
