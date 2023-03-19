import { BaseException, Status } from '@domain/exceptions';

export class UserWebhookNotificationNotFoundException extends BaseException {
  readonly code = Status.NOT_FOUND;
}
