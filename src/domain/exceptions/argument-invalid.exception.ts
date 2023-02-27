import { BaseException, Status } from './base.exception';

export class ArgumentInvalidException extends BaseException {
  readonly code = Status.INTERNAL_ERROR;
}
