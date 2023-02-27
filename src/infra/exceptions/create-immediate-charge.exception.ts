import { BaseException, Status } from '@domain/exceptions';

export class CreateImmediateChargeException extends BaseException {
  readonly code = Status.SERVICE_UNAVAILABLE;
}
