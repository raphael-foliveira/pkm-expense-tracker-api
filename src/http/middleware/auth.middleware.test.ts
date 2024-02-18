import { Request, Response } from 'express';
import { authMiddleware } from './auth.middleware';

describe('authMiddleware', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should throw an error when the token is invalid', () => {
    const responseMock = {
      status: jest.fn(() => responseMock),
      json: jest.fn(),
    } as unknown as Response;
    expect(
      authMiddleware.checkToken(
        { headers: { authorization: 'Bearer invalid_token' } } as Request,
        responseMock,
        () => {},
      ),
    ).rejects.toThrow();
  });
});
