import { Request, Response } from 'express';

const get = (req: Request, res: Response) => {
  return res.status(200).json({ status: 'ok' });
};

export const healthCheckController = {
  get,
};
