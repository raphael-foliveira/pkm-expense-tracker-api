import { config } from 'dotenv';
config({ path: './.env.test' });

import { Express } from 'express';
import * as supertest from 'supertest';
import TestAgent from 'supertest/lib/agent';
import { dataSource } from '../../persistence/data-source';
import { truncateTables } from '../../persistence/helpers';
import { userRepository } from '../../persistence/repository/user';
import { authService } from '../../service/auth';
import { expenseService } from '../../service/expense';
import { signupDtoFactory } from '../../stubs/auth';
import { factoryMultiplier } from '../../stubs/common';
import { createExpenseDtoFactory } from '../../stubs/expense';
import { getApp } from '../server';

describe('ExpenseController', () => {
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

  describe('create', () => {
    it('should successfully create and expense', async () => {
      const {
        tokens: { accessToken },
      } = await authService.signup(signupDtoFactory());
      const { username } = await authService.verifyAccessToken(accessToken);
      const expenseDto = createExpenseDtoFactory();

      const {
        status,
        body: { price, createdBy },
      } = await request
        .post('/expenses')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(expenseDto);

      expect(status).toBe(201);
      expect(price).toEqual(expenseDto.price);
      expect(createdBy.username).toEqual(username);
    });

    it('should successfully list expenses', async () => {
      const numberOfExpenses = 10;
      const expensesDto = factoryMultiplier(
        createExpenseDtoFactory,
        numberOfExpenses,
      );
      const userDto = signupDtoFactory();
      await authService.signup(userDto);
      const user = await userRepository.findOneByEmail(userDto.email);

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
      const {
        tokens: { accessToken },
      } = await authService.signup(signupDtoFactory());
      const user = await authService.verifyAccessToken(accessToken);
      const expenseDto = createExpenseDtoFactory();
      const expense = await expenseService.create(expenseDto, user.id!);

      const { status, body } = await request.get(`/expenses/${expense.id}`);

      expect(status).toBe(200);
      expect(body.price).toEqual(expenseDto.price);
      expect(body.createdBy.username).toEqual(user.username);
    });
  });

  describe('delete', () => {
    it('should successfully delete an expense', async () => {
      const {
        tokens: { accessToken },
      } = await authService.signup(signupDtoFactory());
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
