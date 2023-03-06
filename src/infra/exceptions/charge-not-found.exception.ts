import { BaseException, Status } from '@domain/exceptions';

export class ChargeNotFoundException extends BaseException {
  readonly code = Status.INTERNAL_ERROR;
}
