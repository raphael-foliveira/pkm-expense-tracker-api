import bcrypt from 'bcryptjs';
import { userRepository } from '../persistence/repository/user';
import { LoginDto, SignupDto } from './dto/auth';
import { InvalidCredentialsError } from './errors/auth';
import { InvalidTokenError } from './errors/jwt';
import { jwtService } from './jwt.service';
import { userService } from './user.service';
import { NotFoundError } from './errors/common';

const signup = async (signupData: SignupDto) => {
  const password = await bcrypt.hash(signupData.password, 10);
  const { username } = await userRepository.save({
    ...signupData,
    password,
  });
  return login({
    username,
    password: signupData.password,
  });
};

const login = async ({ username, password }: LoginDto) => {
  const user = await findUserByUsername(username);
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new InvalidCredentialsError();
  }
  const tokens = await jwtService.generateTokens({
    email: user.email,
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
  });
  user.refreshToken = tokens.refreshToken;
  await userRepository.save(user);
  return { tokens, user };
};

const logout = async (token: string) => {
  const { username } = await jwtService.verifyAccessToken(token);
  const user = await findUserByUsername(username);
  user.refreshToken = '';
  return userRepository.save(user);
};

const verifyAccessToken = async (token: string) => {
  const { username } = await jwtService.verifyAccessToken(token);
  return findUserByUsername(username);
};

const refreshAccessToken = async (refreshToken: string) => {
  const { email, username, firstName, lastName } =
    await jwtService.verifyRefreshToken(refreshToken);
  const user = await findUserByUsername(username);
  if (user.refreshToken !== refreshToken) {
    throw new InvalidTokenError();
  }
  const accessToken = await jwtService.signAccessToken({
    email,
    username,
    firstName,
    lastName,
  });
  return { accessToken };
};

const findUserByUsername = async (username: string) => {
  try {
    return await userService.findByUsername(username);
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw new InvalidCredentialsError();
    }
    throw error;
  }
};

export const authService = {
  signup,
  login,
  logout,
  verifyAccessToken,
  refreshAccessToken,
};
