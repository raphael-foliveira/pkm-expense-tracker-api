import 'dotenv/config';
import { Express } from 'express';
import * as supertest from 'supertest';
import TestAgent from 'supertest/lib/agent';
import { DIContainer } from '../../di/container';
import { testDataSource } from '../../persistence/data-source';
import { AuthService } from '../../service/auth';
import { signupDtoFactory } from '../../stubs/auth';
import { getApp } from '../server';

describe('AuthController', () => {
  let app: Express;
  // let userRepository: Repository<User>;
  let request: TestAgent<supertest.Test>;
  let authService: AuthService;
  let container: DIContainer;

  beforeAll(() => {
    const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;
    container = DIContainer.getInstance(testDataSource, {
      accessTokenSecret: ACCESS_TOKEN_SECRET!,
      refreshTokenSecret: REFRESH_TOKEN_SECRET!,
    });
    authService = container.resolveAuthService();
  });

  beforeEach(async () => {
    await testDataSource.initialize();
    app = getApp(testDataSource);
    request = supertest.default(app);
  });

  afterEach(async () => {
    await testDataSource.destroy();
  });

  describe('signup', () => {
    it('should return 201 with tokens when signup is successful', async () => {
      const signupPayload = {
        email: 'test@test.com',
        firstName: 'test',
        lastName: 'test',
        username: 'test',
        password: '123123123',
      };

      const { status, body } = await request
        .post('/auth/signup')
        .send(signupPayload);

      expect(status).toEqual(201);
      expect(body.accessToken).toBeDefined();
    });
  });

  describe('login', () => {
    it('should return 200 with tokens when login is successful', async () => {
      const fakeUser = signupDtoFactory();
      await authService.signup(fakeUser);

      const { status, body } = await request
        .post('/auth/login')
        .send({ email: fakeUser.email, password: fakeUser.password });

      expect(status).toEqual(200);
      expect(body.accessToken).toBeDefined();
    });

    it('should return 401 when login fails', async () => {
      const fakeUser = signupDtoFactory();
      await authService.signup(fakeUser);

      const { status, body } = await request
        .post('/auth/login')
        .send({ email: fakeUser.email, password: 'wrong password' });

      expect(status).toEqual(401);
    });

    it("should return 401 when user doesn't exist", async () => {
      const { status, body } = await request
        .post('/auth/login')
        .send({ email: 'fake@email.com', password: 'fake_password' });

      expect(status).toEqual(401);
    });
  });

  describe('logout', () => {
    it('should return 200 when logout is successful', async () => {
      const fakeUser = signupDtoFactory();
      const { accessToken } = await authService.signup(fakeUser);

      const { status, body } = await request
        .get('/auth/logout')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(status).toBe(200);
      expect(body.message).toBeDefined();
    });
  });

  describe('refreshAccessToken', () => {
    it('should return 201 with new access token when refresh token is valid', async () => {
      jest.useFakeTimers();
      const fakeUser = signupDtoFactory();
      const { refreshToken, accessToken } = await authService.signup(fakeUser);
      jest.advanceTimersByTime(1000 * 60 * 60);

      const { status, body } = await request
        .post('/auth/refresh-token')
        .send({ refreshToken: `Bearer ${refreshToken}` });

      expect(status).toBe(201);
      expect(body.accessToken).toBeDefined();
      expect(body.accessToken).not.toEqual(accessToken);
      jest.clearAllTimers();
    });
  });

  describe('Verify', () => {
    it('should return 200 with user data when access token is valid', async () => {
      const fakeUser = signupDtoFactory();
      const { accessToken } = await authService.signup(fakeUser);

      const { status, body } = await request
        .get('/auth/verify')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(status).toBe(200);
      expect(body.email).toEqual(fakeUser.email);
      expect(body.username).toEqual(fakeUser.username);
      expect(body.firstName).toEqual(fakeUser.firstName);
      expect(body.lastName).toEqual(fakeUser.lastName);
    });
  });
});
