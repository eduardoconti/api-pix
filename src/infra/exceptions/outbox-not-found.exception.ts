import { BaseException, Status } from '@domain/exceptions';

export class OutboxNotFoundException extends BaseException {
  readonly code = Status.INTERNAL_ERROR;
}
