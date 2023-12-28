import { HttpError } from '../../http/exceptions/http-error';

export class InvalidTokenError extends HttpError {
  constructor() {
    super(401, 'Invalid token');
  }
}
