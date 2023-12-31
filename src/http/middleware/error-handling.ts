import { ErrorRequestHandler } from 'express';
import { HttpError } from '../exceptions/http-error';

export const errorHandlingMiddleware: ErrorRequestHandler = (
  error,
  req,
  res,
  next,
) => {
  let status = 500;
  let message = error.message;
  if (error instanceof HttpError) {
    status = error.status;
    message = error.message;
  }
  return res.status(status).json({
    status,
    message,
  });
};
