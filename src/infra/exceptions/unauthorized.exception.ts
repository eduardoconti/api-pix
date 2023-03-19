import { BaseException, Status } from '@domain/exceptions';

export class UnauthorizedException extends BaseException {
  constructor(message?: string, metadata?: unknown) {
    super(message ?? 'User not authorized', metadata);
  }
  readonly code = Status.UNAUTHORIZED;
}
