import { BaseException, Status } from '@domain/exceptions';

export class UnauthorizedException extends BaseException {
  constructor(metadata?: unknown) {
    super('User not authorized', metadata);
  }
  readonly code = Status.UNAUTHORIZED;
}
