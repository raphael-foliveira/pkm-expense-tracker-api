import { RequestHandler } from 'express';

export const useHandler: (handler: RequestHandler) => RequestHandler = (
  handler: RequestHandler,
) => {
  return async (req, res, next) =>
    Promise.resolve(handler(req, res, next)).catch(next);
};
