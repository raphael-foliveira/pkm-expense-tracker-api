import { NextFunction, Request, Response } from 'express';
import { AnyZodObject, z } from 'zod';

const validate = (key: 'body' | 'query' | 'headers' | 'params') => {
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

const validateBody = validate('body');

const validateQueryString = validate('query');

const validateHeaders = validate('headers');

const validateParams = validate('params');

export const validationMiddleware = {
  validateBody,
  validateQueryString,
  validateHeaders,
  validateParams,
};
