import { BaseException, Status } from '@domain/exceptions';

export class TokenExpiredException extends BaseException {
  constructor(metadata?: unknown) {
    super('Token expired', metadata);
  }
  readonly code = Status.UNAUTHORIZED;
}
