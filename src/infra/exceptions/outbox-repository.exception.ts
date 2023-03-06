import { BaseException, Status } from '@domain/exceptions';

export class OutboxRepositoryException extends BaseException {
  readonly code = Status.INTERNAL_ERROR;
}
