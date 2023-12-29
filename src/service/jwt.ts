import jwt from 'jsonwebtoken';
import { JwtPayload } from './types/jwt-payload';
import { InvalidTokenError } from './errors/jwt';

interface Secrets {
  accessToken: string;
  refreshToken: string;
}

export class JwtService {
  constructor(private secrets: Secrets) {}

  async signAccessToken(payload: JwtPayload) {
    return jwt.sign(payload, this.secrets.accessToken, {
      expiresIn: '4h',
    });
  }

  async signRefreshToken(payload: JwtPayload) {
    return jwt.sign(payload, this.secrets.refreshToken, { expiresIn: '120h' });
  }

  async generateTokens(payload: JwtPayload) {
    const accessToken = await this.signAccessToken(payload);
    const refreshToken = await this.signRefreshToken(payload);
    return {
      accessToken,
      refreshToken,
    };
  }

  async verifyAccessToken(token: string) {
    try {
      return jwt.verify(token, this.secrets.accessToken) as JwtPayload;
    } catch {
      throw new InvalidTokenError();
    }
  }

  async verifyRefreshToken(token: string) {
    try {
      return jwt.verify(token, this.secrets.refreshToken) as JwtPayload;
    } catch {
      throw new InvalidTokenError();
    }
  }
}
