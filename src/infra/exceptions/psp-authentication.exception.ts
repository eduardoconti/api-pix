import { BaseException, Status } from '@domain/exceptions';

export class PspAuthenticationException extends BaseException {
  readonly code = Status.SERVICE_UNAVAILABLE;
}
