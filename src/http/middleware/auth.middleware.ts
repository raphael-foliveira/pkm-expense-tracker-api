import { NextFunction, Request, RequestHandler, Response } from 'express';
import { jwtService } from '../../service/jwt.service';

const checkToken: RequestHandler = async (
  { headers: { authorization } }: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    return jwtService.verifyAccessToken(authorization!).then(() => next());
  } catch {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

export const authMiddleware = {
  checkToken,
};
