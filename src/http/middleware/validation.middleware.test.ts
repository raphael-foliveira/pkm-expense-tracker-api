import { z } from 'zod';
import { validate } from './validation.middleware';
import { Request, Response } from 'express';

describe('validation', () => {
  it('should throw an error when data is invalid', () => {
    const MockSchema = z.object({
      name: z.string(),
    });

    const middleware = validate.body(MockSchema);
    expect(
      middleware(
        { body: { invalidData: 'invalid data' } } as Request,
        {} as Response,
        () => {},
      ),
    ).rejects.toThrow();
  });
});
