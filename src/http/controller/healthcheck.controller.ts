import { RequestHandler } from 'express';

const get: RequestHandler = (req, res) => {
  return res.status(200).json({ status: 'ok' });
};

export const healthCheckController = {
  get,
};
