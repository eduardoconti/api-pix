import { BaseException, Status } from '@domain/exceptions';

export class UserNotFoundException extends BaseException {
  readonly code = Status.INTERNAL_ERROR;
}
