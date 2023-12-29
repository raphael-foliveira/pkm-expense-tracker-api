import { Request, Response } from 'express';
import { AuthService } from '../../service/auth';
import { UserMapper } from './mappers/user';

export class AuthController {
  constructor(private service: AuthService) {}

  async signup({ body }: Request, res: Response) {
    const tokens = await this.service.signup(body);
    return res.status(201).json(tokens);
  }

  async login({ body }: Request, res: Response) {
    const tokens = await this.service.login(body);
    return res.status(200).json(tokens);
  }

  async logout({ headers: { authorization } }: Request, res: Response) {
    await this.service.logout(authorization!);
    return res.status(200).json({ message: 'Logout successful' });
  }

  async refreshAccessToken({ body: { refreshToken } }: Request, res: Response) {
    const tokens = await this.service.refreshAccessToken(refreshToken);
    return res.status(201).json(tokens);
  }

  async verify({ headers: { authorization } }: Request, res: Response) {
    const user = await this.service.verifyAccessToken(authorization!);
    const userResponseDto = UserMapper.toResponseDto(user);
    return res.status(200).json(userResponseDto);
  }
}
