import bcrypt from 'bcryptjs';
import { userRepository } from '../persistence/repository/user';
import { LoginDto, SignupDto } from './dto/auth';
import { InvalidCredentialsError } from './errors/auth';
import { InvalidTokenError } from './errors/jwt';
import { jwtService } from './jwt';
import { userService } from './user';
import { NotFoundError } from './errors/common';

const signup = async (signupData: SignupDto) => {
  const password = await bcrypt.hash(signupData.password, 10);
  const { email } = await userRepository.save({
    ...signupData,
    password,
  });
  return login({
    email,
    password: signupData.password,
  });
};

const login = async ({ email, password }: LoginDto) => {
  const user = await findUserByEmail(email);
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
  return tokens;
};

const logout = async (token: string) => {
  const { email } = await jwtService.verifyAccessToken(token);
  const user = await findUserByEmail(email);
  user.refreshToken = '';
  return userRepository.save(user);
};

const verifyAccessToken = async (token: string) => {
  const { email } = await jwtService.verifyAccessToken(token);
  return findUserByEmail(email);
};

const refreshAccessToken = async (refreshToken: string) => {
  const { email, username, firstName, lastName } =
    await jwtService.verifyRefreshToken(refreshToken);
  const user = await findUserByEmail(email);
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

const findUserByEmail = async (email: string) => {
  try {
    return await userService.findByEmail(email);
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
