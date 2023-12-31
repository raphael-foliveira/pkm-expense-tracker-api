import { HttpError } from '../../http/exceptions/http-error';

export class InvalidCredentialsError extends HttpError {
  constructor() {
    super(401, 'Credenciais inválidas');
  }
}
