import { NextFunction, Request, Response } from 'express';
import { AnyZodObject, z } from 'zod';

const wrapValidation = (key: 'body' | 'query' | 'headers' | 'params') => {
  return (schema: AnyZodObject) =>
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        req[key] = schema.parse(req[key]);
        next();
      } catch (error) {
        if (error instanceof z.ZodError) {
          const message = JSON.parse(error.message);
          return res.status(400).json(message);
        }
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
      }
    };
};

const body = wrapValidation('body');

const queryString = wrapValidation('query');

const headers = wrapValidation('headers');

const params = wrapValidation('params');

export const validate = {
  body,
  queryString,
  headers,
  params,
};
