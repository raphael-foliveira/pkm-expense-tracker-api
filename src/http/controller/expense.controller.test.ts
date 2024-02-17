import { config } from 'dotenv';
config({ path: './.env.test' });

import { Express } from 'express';
import supertest from 'supertest';
import TestAgent from 'supertest/lib/agent';
import { jwtService } from '../../service/jwt.service';
import { factoryMultiplier } from '../../stubs/common';
import { createExpenseDtoFactory, expenseFactory } from '../../stubs/expense';
import { userFactory } from '../../stubs/user';
import {
  expenseRepositoryMock,
  mockExpenseRepository,
} from '../../tests/mocks/repository/expense.repository.mock';
import {
  mockUserRepository,
  userRepositoryMock,
} from '../../tests/mocks/repository/user.repository.mock';
import { getApp } from '../server';

describe('ExpenseController', () => {
  let app: Express;
  let request: TestAgent<supertest.Test>;

  beforeAll(async () => {
    mockUserRepository();
    mockExpenseRepository();
    app = getApp();
    request = supertest(app);
  });

  describe('create', () => {
    it('should successfully create and expense', async () => {
      const user = userFactory();
      const accessToken = await jwtService.signAccessToken(user);
      const expenseDto = createExpenseDtoFactory();
      const expense = { ...expenseFactory(), ...expenseDto, user };
      userRepositoryMock('findOneByUsername', user);
      userRepositoryMock('findOneById', user);
      expenseRepositoryMock('save', expense);

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
      expenseRepositoryMock('find', expenses);

      const { status, body } = await request.get('/expenses');

      expect(status).toBe(200);
      expect(body.length).toEqual(numberOfExpenses);
    });
  });

  describe('findOne', () => {
    it('should successfully find an expense', async () => {
      const expense = expenseFactory();
      const user = userFactory();
      expenseRepositoryMock('findOneById', { ...expense, user });

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
      userRepositoryMock('findOneByUsername', user);
      expenseRepositoryMock('findOneById', { ...expense, user });
      expenseRepositoryMock('remove', expense);

      const { status, body } = await request
        .delete(`/expenses/${expense.id}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(status).toBe(204);
      expect(body).toEqual({});
    });
  });
});
