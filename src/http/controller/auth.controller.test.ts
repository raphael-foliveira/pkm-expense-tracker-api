import { config } from 'dotenv';
config({ path: './.env.test' });

import { hashSync } from 'bcryptjs';
import { Express } from 'express';
import supertest from 'supertest';
import TestAgent from 'supertest/lib/agent';
import { userRepository } from '../../persistence/repository/user';
import { jwtService } from '../../service/jwt.service';
import { signupDtoFactory } from '../../stubs/auth';
import { userFactory } from '../../stubs/user';
import { mockUserRepository } from '../../tests/mocks/repository/user.repository.mock';
import { getApp } from '../server';

describe('AuthController', () => {
  let app: Express;
  let request: TestAgent<supertest.Test>;

  beforeAll(async () => {
    mockUserRepository();
    app = getApp();
    request = supertest(app);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('signup', () => {
    it('should return 201 with tokens when signup is successful', async () => {
      const signupPayload = signupDtoFactory();
      const hashedPassword = hashSync(signupPayload.password, 10);

      jest.spyOn(userRepository, 'save').mockResolvedValue({
        ...userFactory(),
        ...signupPayload,
        password: hashedPassword,
      });
      jest.spyOn(userRepository, 'findOneByUsername').mockResolvedValue({
        ...userFactory(),
        ...signupPayload,
        password: hashedPassword,
      });

      const { status, body } = await request
        .post('/auth/signup')
        .send(signupPayload);

      expect(status).toEqual(201);
      expect(body.tokens.accessToken).toBeDefined();
      expect(body.tokens.refreshToken).toBeDefined();
    });
  });

  describe('login', () => {
    it('should return 200 with tokens when login is successful', async () => {
      const password = 'some_password';
      const hashedPassword = hashSync(password, 10);
      const user = userFactory();
      jest.spyOn(userRepository, 'findOneByUsername').mockResolvedValue({
        ...user,
        password: hashedPassword,
      });
      const { status, body } = await request
        .post('/auth/login')
        .send({ username: user.username, password });

      expect(status).toEqual(200);
      expect(body.tokens.accessToken).toBeDefined();
      expect(body.tokens.refreshToken).toBeDefined();
    });

    it('should return 401 when login fails', async () => {
      const user = userFactory();
      jest.spyOn(userRepository, 'findOneByUsername').mockResolvedValue(user);

      const { status } = await request
        .post('/auth/login')
        .send({ username: user.username, password: 'wrong password' });

      expect(status).toEqual(401);
    });

    it("should return 401 when user doesn't exist", async () => {
      const { status } = await request
        .post('/auth/login')
        .send({ username: 'fakeusername', password: 'fake_password' });

      expect(status).toEqual(401);
    });
  });

  describe('logout', () => {
    it('should return 200 when logout is successful', async () => {
      const user = userFactory();
      const accessToken = await jwtService.signAccessToken(user);
      jest.spyOn(userRepository, 'findOneByUsername').mockResolvedValue(user);

      const { status, body } = await request
        .get('/auth/logout')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(status).toBe(200);
      expect(body.message).toBeDefined();
    });
  });

  describe('refreshAccessToken', () => {
    it('should return 201 with new access token when refresh token is valid', async () => {
      const user = userFactory();
      const refreshToken = await jwtService.signRefreshToken(user);
      const verifyRefreshTokenSpy = jest.spyOn(
        jwtService,
        'verifyRefreshToken',
      );
      jest
        .spyOn(userRepository, 'findOneByUsername')
        .mockResolvedValue({ ...user, refreshToken });

      const { status, body } = await request
        .post('/auth/refresh-token')
        .send({ refreshToken: `Bearer ${refreshToken}` });

      expect(status).toBe(201);
      expect(body.accessToken).toBeDefined();
      expect(verifyRefreshTokenSpy).toHaveBeenCalledWith(refreshToken);
    });
  });

  describe('Verify', () => {
    it('should return 200 with user data when access token is valid', async () => {
      const user = userFactory();
      const accessToken = await jwtService.signAccessToken(user);
      jest.spyOn(userRepository, 'findOneByUsername').mockResolvedValue(user);

      const { status, body } = await request
        .get('/auth/verify')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(status).toBe(200);
      expect(body.email).toEqual(user.email);
      expect(body.username).toEqual(user.username);
      expect(body.fullName).toEqual(`${user.firstName} ${user.lastName}`);
    });
  });
});
