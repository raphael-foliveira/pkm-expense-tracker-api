import { Request, Response } from 'express';

export class HealthCheckController {
  get(req: Request, res: Response) {
    return res.status(200).json({ status: 'ok' });
  }
}
