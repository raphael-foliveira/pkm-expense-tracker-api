import { config } from 'dotenv';
config({ path: './.env.test' });

import { hashSync } from 'bcryptjs';
import { Express } from 'express';
import supertest from 'supertest';
import TestAgent from 'supertest/lib/agent';
import jwtService from '../../service/jwt.service';
import { mocks } from '../../tests/mocks';
import { getApp } from '../server/server';
import { userFactory, userStub } from '../../tests/stubs/user';
import { signupDtoFactory } from '../../tests/stubs/auth';

describe('AuthController', () => {
  let app: Express;
  let request: TestAgent<supertest.Test>;

  beforeAll(async () => {
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
      const returnedUser = {
        ...userFactory(),
        ...signupPayload,
        password: hashedPassword,
      };

      mocks.userRepository('save', returnedUser);
      mocks.userRepository('findOneByUsername', returnedUser);

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
      mocks.userRepository('findOneByUsername', {
        ...userStub,
        password: hashedPassword,
      });
      const { status, body } = await request
        .post('/auth/login')
        .send({ username: userStub.username, password });

      expect(status).toEqual(200);
      expect(body.tokens.accessToken).toBeDefined();
      expect(body.tokens.refreshToken).toBeDefined();
    });

    it('should return 401 when login fails', async () => {
      mocks.userRepository('findOneByUsername', userStub);

      const { status } = await request
        .post('/auth/login')
        .send({ username: userStub.username, password: 'wrong password' });

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
      const accessToken = await jwtService.signAccessToken(userStub);
      mocks.userRepository('findOneByUsername', userStub);

      const { status, body } = await request
        .get('/auth/logout')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(status).toBe(200);
      expect(body.message).toBeDefined();
    });
  });

  describe('refreshAccessToken', () => {
    it('should return 201 with new access token when refresh token is valid', async () => {
      const refreshToken = await jwtService.signRefreshToken(userStub);
      const verifyRefreshTokenSpy = jest.spyOn(
        jwtService,
        'verifyRefreshToken',
      );
      mocks.userRepository('findOneByUsername', { ...userStub, refreshToken });

      const { status, body } = await request
        .post('/auth/refresh-token')
        .send({ refreshToken });

      expect(status).toBe(201);
      expect(body.accessToken).toBeDefined();
      expect(verifyRefreshTokenSpy).toHaveBeenCalledWith(refreshToken);
    });
  });

  describe('Verify', () => {
    it('should return 200 with user data when access token is valid', async () => {
      const accessToken = await jwtService.signAccessToken(userStub);
      mocks.userRepository('findOneByUsername', userStub);

      const { status, body } = await request
        .get('/auth/verify')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(status).toBe(200);
      expect(body.email).toEqual(userStub.email);
      expect(body.username).toEqual(userStub.username);
      expect(body.fullName).toEqual(
        `${userStub.firstName} ${userStub.lastName}`,
      );
    });
  });
});
