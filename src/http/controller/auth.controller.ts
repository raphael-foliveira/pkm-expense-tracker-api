import { RequestHandler } from 'express';
import { authService } from '../../service/auth.service';
import { userMapper } from './mappers/user.mapper';
import { userService } from '../../service/user.service';

const signup: RequestHandler = async ({ body }, res) => {
  const tokens = await authService.signup(body);
  return res.status(201).json(tokens);
};

const login: RequestHandler = async ({ body }, res) => {
  const data = await authService.login(body);
  return res.status(200).json(data);
};

const logout: RequestHandler = async ({ headers: { authorization } }, res) => {
  await authService.logout(authorization!);
  return res.status(200).json({ message: 'Logout successful' });
};

const refreshAccessToken: RequestHandler = async (
  { body: { refreshToken } },
  res,
) => {
  const accessToken = await authService.refreshAccessToken(refreshToken);
  return res.status(201).json({ accessToken });
};

const verify: RequestHandler = async ({ headers: { authorization } }, res) => {
  const user = await authService.verifyAccessToken(authorization!);
  const userResponseDto = userMapper.toResponseDto(user);
  return res.status(200).json(userResponseDto);
};

const deleteUser: RequestHandler = async ({ params: { id } }, res) => {
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
