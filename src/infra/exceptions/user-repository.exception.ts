import { BaseException, Status } from '@domain/exceptions';

export class UserRepositoryException extends BaseException {
  readonly code = Status.INTERNAL_ERROR;
}
