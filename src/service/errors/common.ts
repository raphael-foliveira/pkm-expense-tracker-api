import { HttpError } from '../../http/exceptions/http-error';

export class NotFoundError extends HttpError {
  constructor(message: string) {
    super(404, message);
  }
}
