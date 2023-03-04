import { BaseException, Status } from '@domain/exceptions';

export class CreateChargeException extends BaseException {
  readonly code = Status.INTERNAL_ERROR;
}
