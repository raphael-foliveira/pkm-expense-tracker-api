import { config } from 'dotenv';
config({ path: './.env.test' });

import { Express } from 'express';
import supertest from 'supertest';
import TestAgent from 'supertest/lib/agent';
import { jwtService } from '../../service/jwt.service';
import { factoryMultiplier } from '../../stubs/common';
import { createExpenseDtoFactory, expenseFactory } from '../../stubs/expense';
import { userFactory } from '../../stubs/user';
import { mocks } from '../../tests/mocks';
import { getApp } from '../server/server';

describe('ExpenseController', () => {
  let app: Express;
  let request: TestAgent<supertest.Test>;

  beforeAll(async () => {
    app = getApp();
    request = supertest(app);
  });

  describe('create', () => {
    it('should successfully create and expense', async () => {
      const user = userFactory();
      const accessToken = await jwtService.signAccessToken(user);
      const expenseDto = createExpenseDtoFactory();
      const expense = { ...expenseFactory(), ...expenseDto, user };
      mocks.userRepository('findOneByUsername', user);
      mocks.userRepository('findOneById', user);
      mocks.expenseRepository('save', expense);

      const { status, body } = await request
        .post('/expenses')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(expenseDto);

      expect(status).toBe(201);
      expect(body.price).toEqual(expenseDto.price);
      expect(body.createdBy.username).toEqual(user.username);
    });

    it('should successfully list expenses', async () => {
      const numberOfExpenses = 5;
      const expenses = factoryMultiplier(expenseFactory, numberOfExpenses);
      mocks.expenseRepository('find', expenses);

      const { status, body } = await request.get('/expenses');

      expect(status).toBe(200);
      expect(body.length).toEqual(numberOfExpenses);
    });
  });

  describe('findOne', () => {
    it('should successfully find an expense', async () => {
      const expense = expenseFactory();
      const user = userFactory();
      mocks.expenseRepository('findOneById', { ...expense, user });

      const { status, body } = await request.get(`/expenses/${expense.id}`);

      expect(status).toBe(200);
      expect(body.price).toEqual(expense.price);
      expect(body.createdBy.username).toEqual(user.username);
    });
  });

  describe('delete', () => {
    it('should successfully delete an expense', async () => {
      const user = userFactory();
      const expense = expenseFactory();
      const accessToken = await jwtService.signAccessToken(user);
      mocks.userRepository('findOneByUsername', user);
      mocks.expenseRepository('findOneById', { ...expense, user });
      mocks.expenseRepository('remove', expense);

      const { status, body } = await request
        .delete(`/expenses/${expense.id}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(status).toBe(204);
      expect(body).toEqual({});
    });
  });
  describe('getByMonth', () => {
    it('should successfully get expenses by month', async () => {
      const accessToken = await jwtService.signAccessToken(userFactory());
      const expenses = factoryMultiplier(expenseFactory, 5);
      mocks.expenseRepository('getByMonth', expenses);

      const { status, body } = await request
        .get('/expenses/month/5/2021')
        .set({ Authorization: `Bearer ${accessToken}` });

      expect(status).toBe(200);
      expect(body.length).toEqual(5);
    });
  });
});
