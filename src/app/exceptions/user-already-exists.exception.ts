import { BaseException, Status } from '@domain/exceptions';

export class UserAlreadyExistsException extends BaseException {
  constructor(readonly metadata?: unknown) {
    super('User already exists', metadata);
  }
  readonly code = Status.INVALID_REQUEST;
}
