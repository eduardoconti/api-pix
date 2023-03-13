import { BaseException, Status } from '@domain/exceptions';

export class RegisterUserException extends BaseException {
  readonly code = Status.INTERNAL_ERROR;
}
