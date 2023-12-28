import { NextFunction, Request, Response } from 'express';
import { AnyZodObject, z } from 'zod';

const validate = (key: 'body' | 'query' | 'headers') => {
  return (schema: AnyZodObject) =>
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        req[key] = schema.parse(req[key]);
        next();
      } catch (error) {
        if (error instanceof z.ZodError) {
          const message = JSON.parse(error.message);
          return res.status(400).json({ message });
        }
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
      }
    };
};

export const validateBody = validate('body');

export const validateQueryString = validate('query');

export const validateHeaders = validate('headers');
