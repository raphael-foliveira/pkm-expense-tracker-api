import { config } from 'dotenv';
config({ path: '.env.test' });

import supertest from 'supertest';
import { getApp } from '../server/server';
import TestAgent from 'supertest/lib/agent';

describe('HealthCheckController', () => {
  let request: TestAgent<supertest.Test>;

  beforeAll(() => {
    const app = getApp();
    request = supertest(app);
  });
  test('should return 200', async () => {
    const { status } = await request.get('/healthcheck');
    expect(status).toBe(200);
  });
});
