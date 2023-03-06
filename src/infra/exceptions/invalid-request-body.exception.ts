import { BaseException, Status } from '@domain/exceptions';

export type InvalidFields = {
  field: string;
  reason: string;
};

export class InvalidRequestBodyException extends BaseException {
  readonly code = Status.INVALID_REQUEST;

  constructor(private readonly _invalidFields: InvalidFields[]) {
    super('Some fields are in wrong format');
  }

  get invalidFields() {
    return this._invalidFields;
  }
}
