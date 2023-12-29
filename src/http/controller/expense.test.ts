import { config } from 'dotenv';
config({ path: './.env.test' });

import { Express } from 'express';
import * as supertest from 'supertest';
import TestAgent from 'supertest/lib/agent';
import { DIContainer } from '../../di/container';
import { dataSource } from '../../persistence/data-source';
import { AuthService } from '../../service/auth';
import { ExpenseService } from '../../service/expense';
import { UserService } from '../../service/user';
import { signupDtoFactory } from '../../stubs/auth';
import { factoryMultiplier } from '../../stubs/common';
import { createExpenseDtoFactory } from '../../stubs/expense';
import { getApp } from '../server';
import { deleteTables, truncateTables } from '../../persistence/helpers';

const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;

describe('ExpenseController', () => {
  let app: Express;
  let request: TestAgent<supertest.Test>;
  let userService: UserService;
  let authService: AuthService;
  let expenseService: ExpenseService;
  let container: DIContainer;

  beforeAll(async () => {
    await dataSource.initialize();
    app = getApp(dataSource);
    request = supertest.default(app);
    container = DIContainer.getInstance(dataSource, {
      accessTokenSecret: ACCESS_TOKEN_SECRET!,
      refreshTokenSecret: REFRESH_TOKEN_SECRET!,
    });
    authService = container.resolveAuthService();
    expenseService = container.resolveExpenseService();
    userService = container.resolveUserService();
  });

  afterEach(async () => {
    await truncateTables();
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  describe('create', () => {
    it('should successfully create and expense', async () => {
      const { accessToken } = await authService.signup(signupDtoFactory());
      const user = await authService.verifyAccessToken(accessToken);
      const expenseDto = createExpenseDtoFactory();

      const { status, body } = await request
        .post('/expenses')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(expenseDto);

      expect(status).toBe(201);
      expect(body.price).toEqual(expenseDto.price);
      expect(body.user.username).toEqual(user.username);
    });

    it('should successfully list expenses', async () => {
      const numberOfExpenses = 10;
      const expensesDto = factoryMultiplier(
        createExpenseDtoFactory,
        numberOfExpenses,
      );
      const userDto = signupDtoFactory();
      await authService.signup(userDto);
      const user = await userService.findOneByEmail(userDto.email);

      await Promise.all(
        expensesDto.map((expense) => expenseService.create(expense, user!.id!)),
      );

      const { status, body } = await request.get('/expenses');

      expect(status).toBe(200);
      expect(body.length).toEqual(numberOfExpenses);
    });
  });

  describe('findOne', () => {
    it('should successfully find an expense', async () => {
      const { accessToken } = await authService.signup(signupDtoFactory());
      const user = await authService.verifyAccessToken(accessToken);
      const expenseDto = createExpenseDtoFactory();
      const expense = await expenseService.create(expenseDto, user.id!);

      const { status, body } = await request.get(`/expenses/${expense.id}`);

      expect(status).toBe(200);
      expect(body.price).toEqual(expenseDto.price);
      expect(body.user.username).toEqual(user.username);
    });
  });

  describe('delete', () => {
    it('should successfully delete an expense', async () => {
      const { accessToken } = await authService.signup(signupDtoFactory());
      const user = await authService.verifyAccessToken(accessToken);
      const expenseDto = createExpenseDtoFactory();
      const expense = await expenseService.create(expenseDto, user.id!);

      const { status, body } = await request
        .delete(`/expenses/${expense.id}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(status).toBe(204);
      expect(body).toEqual({});
    });
  });
});
