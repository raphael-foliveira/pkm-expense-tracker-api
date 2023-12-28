import jwt from 'jsonwebtoken';
import { JwtPayload } from './types/jwt-payload';

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
    return jwt.verify(token, this.secrets.accessToken) as JwtPayload;
  }

  async verifyRefreshToken(token: string) {
    return jwt.verify(token, this.secrets.refreshToken) as JwtPayload;
  }

  async refreshAccessToken(refreshToken: string) {
    const payload = await this.verifyRefreshToken(refreshToken);
    return this.signAccessToken(payload);
  }
}
