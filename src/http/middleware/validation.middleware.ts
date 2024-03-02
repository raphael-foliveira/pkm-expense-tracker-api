import { Request, RequestHandler } from 'express';
import { AnyZodObject, z } from 'zod';

type ValidationFunction = (req: Request, schema: AnyZodObject) => void;

const wrapValidation = (fn: ValidationFunction) => {
  return (schema: AnyZodObject): RequestHandler => {
    return async (req, res, next) => {
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
