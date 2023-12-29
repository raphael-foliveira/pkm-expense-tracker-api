import jwt from 'jsonwebtoken';
import { JwtPayload } from './types/jwt-payload';
import { InvalidTokenError } from './errors/jwt';

const secrets = {
  accessToken: process.env.ACCESS_TOKEN_SECRET!,
  refreshToken: process.env.REFRESH_TOKEN_SECRET!,
};

const signAccessToken = async (payload: JwtPayload) => {
  return jwt.sign(payload, secrets.accessToken, {
    expiresIn: '4h',
  });
};

const signRefreshToken = async (payload: JwtPayload) => {
  return jwt.sign(payload, secrets.refreshToken, { expiresIn: '120h' });
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
    return jwt.verify(token, secrets.accessToken) as JwtPayload;
  } catch {
    throw new InvalidTokenError();
  }
};

const verifyRefreshToken = async (token: string) => {
  try {
    return jwt.verify(token, secrets.refreshToken) as JwtPayload;
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
