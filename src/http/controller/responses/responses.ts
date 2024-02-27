import { Response } from 'express';

const ok = (res: Response, data: any) => {
  return res.status(200).json(data);
};

const created = (res: Response, data: any) => {
  return res.status(201).json(data);
};

const noContent = (res: Response) => {
  return res.status(204).send();
};

export const response = {
  ok,
  created,
  noContent,
};
