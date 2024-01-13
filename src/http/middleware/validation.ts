import { NextFunction, Request, Response } from 'express';
import { AnyZodObject, z } from 'zod';

const wrapValidation = (key: 'body' | 'query' | 'headers' | 'params') => {
  return (schema: AnyZodObject) =>
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        req[key] = schema.parse(req[key]);
        return next();
      } catch (error) {
        if (error instanceof z.ZodError) {
          const message = JSON.parse(error.message);
          return res.status(400).json(message);
        }
        return res.status(500).json({ message: 'Internal server error' });
      }
    };
};

export const validate = {
  body: wrapValidation('body'),
  queryString: wrapValidation('query'),
  headers: wrapValidation('headers'),
  params: wrapValidation('params'),
};
