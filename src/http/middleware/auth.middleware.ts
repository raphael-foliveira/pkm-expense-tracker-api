import { RequestHandler } from 'express';
import jwtService from '../../service/jwt.service';

const checkToken: RequestHandler = async (
  { headers: { authorization } },
  res,
  next,
) => {
  try {
    await jwtService.verifyAccessToken(authorization!);
    return next();
  } catch (err) {
    console.log(err);
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

const checkApiKey: RequestHandler = async (
  { headers: { ['x-api-key']: apiKey } },
  res,
  next,
) => {};

export const authMiddleware = {
  checkToken,
};
