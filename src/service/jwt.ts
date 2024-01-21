import jwt from 'jsonwebtoken';
import { JwtPayload } from './types/jwt-payload';
import { InvalidTokenError } from './errors/jwt';
import { config } from './config';

const { accessToken, refreshToken } = config.secrets;

const { accessToken, refreshToken } = configService.secrets;

const { accessToken, refreshToken } = configService.secrets;

const signAccessToken = async (payload: JwtPayload) => {
  return jwt.sign(payload, accessToken, {
    expiresIn: '4h',
  });
};

const signRefreshToken = async (payload: JwtPayload) => {
  return jwt.sign(payload, refreshToken, {
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
    return jwt.verify(token, accessToken) as JwtPayload;
  } catch {
    throw new InvalidTokenError();
  }
};

const verifyRefreshToken = async (token: string) => {
  try {
    return jwt.verify(token, refreshToken) as JwtPayload;
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
