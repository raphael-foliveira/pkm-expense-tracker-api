import { NextFunction, Request, RequestHandler, Response } from 'express';

export const useHandler = (handler: RequestHandler) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
};
