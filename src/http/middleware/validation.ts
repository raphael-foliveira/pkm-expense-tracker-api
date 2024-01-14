import { NextFunction, Request, Response } from 'express';
import { AnyZodObject, z } from 'zod';

const wrapValidation = (fn: (r: Request, s: AnyZodObject) => void) => {
  return (schema: AnyZodObject) => {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        fn(req, schema);
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
};

export const validate = {
  body: wrapValidation((r, s) => (r.body = s.parse(r.body))),
  queryString: wrapValidation((r, s) => (r.query = s.parse(r.query))),
  headers: wrapValidation((r, s) => (r.headers = s.parse(r.headers))),
  params: wrapValidation((r, s) => (r.params = s.parse(r.params))),
};
