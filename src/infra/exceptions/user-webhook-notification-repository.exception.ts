import { BaseException, Status } from '@domain/exceptions';

export class UserWebhookNotificationRepositoryException extends BaseException {
  readonly code = Status.INTERNAL_ERROR;
}
