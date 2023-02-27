import { BaseException, Status } from './base.exception';

export class ArgumentNotProvidedException extends BaseException {
  readonly code = Status.INTERNAL_ERROR;
}
