import { config } from 'dotenv';
config({ path: './.env.test' });

import { Express } from 'express';
import supertest from 'supertest';
import TestAgent from 'supertest/lib/agent';
import jwtService from '../../service/jwt.service';
import { mocks } from '../../tests/mocks';
import { getApp } from '../server/server';
import { factoryMultiplier } from '../../tests/stubs/common';
import {
  createExpenseDtoFactory,
  expenseFactory,
} from '../../tests/stubs/expense';
import { userFactory, userStub } from '../../tests/stubs/user';

describe('ExpenseController', () => {
  let app: Express;
  let request: TestAgent<supertest.Test>;

  beforeAll(async () => {
    app = getApp();
    request = supertest(app);
  });

  describe('create', () => {
    it('should successfully create and expense', async () => {
      const accessToken = await jwtService.signAccessToken(userStub);
      const expenseDto = createExpenseDtoFactory();
      const expense = { ...expenseFactory(), ...expenseDto, user: userStub };
      mocks.userRepository('findOneByUsername', userStub);
      mocks.userRepository('findOneById', userStub);
      mocks.expenseRepository('save', expense);

      const { status, body } = await request
        .post('/expenses')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(expenseDto);

      expect(status).toBe(201);
      expect(body.price).toEqual(expenseDto.price);
      expect(body.createdBy.username).toEqual(userStub.username);
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
      mocks.expenseRepository('findOneById', { ...expense, user: userStub });

      const { status, body } = await request.get(`/expenses/${expense.id}`);

      expect(status).toBe(200);
      expect(body.price).toEqual(expense.price);
      expect(body.createdBy.username).toEqual(userStub.username);
    });
  });

  describe('delete', () => {
    it('should successfully delete an expense', async () => {
      const expense = expenseFactory();
      const accessToken = await jwtService.signAccessToken(userStub);
      mocks.userRepository('findOneByUsername', userStub);
      mocks.expenseRepository('findOneById', { ...expense, user: userStub });
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
