import { BaseException, Status } from '@domain/exceptions';

export class InvalidTokenException extends BaseException {
  constructor(metadata?: unknown) {
    super('Invalid token', metadata);
  }
  readonly code = Status.UNAUTHORIZED;
}
