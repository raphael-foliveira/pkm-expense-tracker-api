import { config } from 'dotenv';
config({ path: './.env.test' });

import { Express } from 'express';
import * as supertest from 'supertest';
import TestAgent from 'supertest/lib/agent';
import { dataSource } from '../../persistence/data-source';
import { truncateTables } from '../../persistence/helpers';
import { authService } from '../../service/auth';
import { jwtService } from '../../service/jwt';
import { signupDtoFactory } from '../../stubs/auth';
import { getApp } from '../server';

describe('AuthController', () => {
  let app: Express;
  let request: TestAgent<supertest.Test>;

  beforeAll(async () => {
    await dataSource.initialize();
    app = getApp();
    request = supertest.default(app);
  });

  afterEach(async () => {
    await truncateTables();
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  describe('signup', () => {
    it('should return 201 with tokens when signup is successful', async () => {
      const signupPayload = signupDtoFactory();

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
      const fakeUser = signupDtoFactory();
      await authService.signup(fakeUser);

      const { status, body } = await request
        .post('/auth/login')
        .send({ username: fakeUser.username, password: fakeUser.password });

      expect(status).toEqual(200);
      expect(body.tokens.accessToken).toBeDefined();
      expect(body.tokens.refreshToken).toBeDefined();
    });

    it('should return 401 when login fails', async () => {
      const fakeUser = signupDtoFactory();
      await authService.signup(fakeUser);

      const { status } = await request
        .post('/auth/login')
        .send({ username: fakeUser.username, password: 'wrong password' });

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
      const fakeUser = signupDtoFactory();
      const {
        tokens: { accessToken },
      } = await authService.signup(fakeUser);

      const { status, body } = await request
        .get('/auth/logout')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(status).toBe(200);
      expect(body.message).toBeDefined();
    });
  });

  describe('refreshAccessToken', () => {
    it('should return 201 with new access token when refresh token is valid', async () => {
      const fakeUser = signupDtoFactory();
      const {
        tokens: { refreshToken },
      } = await authService.signup(fakeUser);
      const verifyRefreshTokenSpy = jest.spyOn(
        jwtService,
        'verifyRefreshToken',
      );

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
      const fakeUser = signupDtoFactory();
      const {
        tokens: { accessToken },
      } = await authService.signup(fakeUser);

      const { status, body } = await request
        .get('/auth/verify')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(status).toBe(200);
      expect(body.email).toEqual(fakeUser.email);
      expect(body.username).toEqual(fakeUser.username);
      expect(body.fullName).toEqual(
        `${fakeUser.firstName} ${fakeUser.lastName}`,
      );
    });
  });
});
