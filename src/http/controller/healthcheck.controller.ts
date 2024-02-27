import { Request, Response } from 'express';
import { response } from './responses/responses';

const get = (req: Request, res: Response) => {
  return response.ok(res, { status: 'ok' });
};

export const healthCheckController = {
  get,
};
