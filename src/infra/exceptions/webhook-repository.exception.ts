import { BaseException, Status } from '@domain/exceptions';

export class WebhookRepositoryException extends BaseException {
  readonly code = Status.INTERNAL_ERROR;
}
