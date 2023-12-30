import jwt from 'jsonwebtoken';
import { JwtPayload } from './types/jwt-payload';
import { InvalidTokenError } from './errors/jwt';
import { configService } from './config';

const signAccessToken = async (payload: JwtPayload) => {
  return jwt.sign(payload, configService.environment.accessTokenSecret, {
    expiresIn: '4h',
  });
};

const signRefreshToken = async (payload: JwtPayload) => {
  return jwt.sign(payload, configService.environment.refreshTokenSecret, {
    expiresIn: '120h',
  });
};

const generateTokens = async (payload: JwtPayload) => {
  const accessToken = await signAccessToken(payload);
  const refreshToken = await signRefreshToken(payload);
  return {
    accessToken,
    refreshToken,
  };
};

const verifyAccessToken = async (token: string) => {
  try {
    return jwt.verify(
      token,
      configService.environment.accessTokenSecret,
    ) as JwtPayload;
  } catch {
    throw new InvalidTokenError();
  }
};

const verifyRefreshToken = async (token: string) => {
  try {
    return jwt.verify(
      token,
      configService.environment.refreshTokenSecret,
    ) as JwtPayload;
  } catch {
    throw new InvalidTokenError();
  }
};

export const jwtService = {
  signAccessToken,
  signRefreshToken,
  generateTokens,
  verifyAccessToken,
  verifyRefreshToken,
};
