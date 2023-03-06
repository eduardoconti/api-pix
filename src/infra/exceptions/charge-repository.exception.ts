import { BaseException, Status } from '@domain/exceptions';

export class ChargeRepositoryException extends BaseException {
  readonly code = Status.INTERNAL_ERROR;
}
