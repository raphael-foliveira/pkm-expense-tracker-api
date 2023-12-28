import bcrypt from 'bcryptjs';
import { User } from '../persistence/entitites/user';
import { LoginDto, SignupDto } from './dto/auth';
import { InvalidCredentialsError } from './errors/auth';
import { NotFoundError } from './errors/common';
import { UserRepository } from './interfaces/repository';
import { JwtService } from './jwt';
import { InvalidTokenError } from './errors/jwt';

export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signup(signupData: SignupDto) {
    const password = await bcrypt.hash(signupData.password, 10);
    const { email } = await this.userRepository.save({
      ...signupData,
      password,
    });
    return this.login({
      email,
      password: signupData.password,
    });
  }

  async login({ email, password }: LoginDto) {
    const user = await this.findUserByEmail(email);
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new InvalidCredentialsError();
    }
    const tokens = await this.jwtService.generateTokens({
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
    });
    user.refreshToken = tokens.refreshToken;
    await this.userRepository.save(user);
    return tokens;
  }

  async logout(token: string) {
    const { email } = await this.jwtService.verifyAccessToken(token);
    const user = await this.findUserByEmail(email);
    user.refreshToken = '';
    return this.userRepository.save(user);
  }

  async verifyAccessToken(token: string) {
    const { email } = await this.jwtService.verifyAccessToken(token);
    return this.findUserByEmail(email);
  }

  async refreshAccessToken(refreshToken: string) {
    const { email, username, firstName, lastName } =
      await this.jwtService.verifyRefreshToken(refreshToken);
    const user = await this.findUserByEmail(email);
    if (user.refreshToken !== refreshToken) {
      throw new InvalidTokenError();
    }
    const accessToken = await this.jwtService.signAccessToken({
      email,
      username,
      firstName,
      lastName,
    });
    return { accessToken };
  }

  private async findUserByEmail(email: string) {
    const user = await this.userRepository.findOneByEmail(email);
    if (!user) {
      throw new InvalidCredentialsError();
    }
    return user as User & { id: number };
  }

  private async findUserById(id: number) {
    const user = await this.userRepository.findOneById(id);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return user as User & { id: number };
  }
}
