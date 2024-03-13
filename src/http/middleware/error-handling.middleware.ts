import { ErrorRequestHandler } from 'express';
import { HttpError } from '../exceptions/http-error';

const errorHandlingMiddleware: ErrorRequestHandler = (
  error,
  req,
  res,
  next,
) => {
  let status = 500;
  let message = error.message;
  console.log(error);
  if (error instanceof HttpError) {
    status = error.status;
    message = error.message;
  }
  return res.status(status).json({
    status,
    message,
  });
};

export default errorHandlingMiddleware;
