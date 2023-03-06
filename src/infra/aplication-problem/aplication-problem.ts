import { HttpException, HttpStatus } from '@nestjs/common';

import { BaseException, Status } from '@domain/exceptions';

import { InvalidRequestBodyException } from '@infra/exceptions';

export class AplicationProblem {
  status: number;
  title: string;
  type: string;
  detail?: string;
  invalidFields?: InvalidFields[];

  private constructor(props: Partial<AplicationProblem>) {
    this.status = props?.status ?? HttpStatus.INTERNAL_SERVER_ERROR;
    this.title = props?.title ?? 'Internal server error';
    this.type = props?.type ?? 'about:blank';
    this.detail = props?.detail;
    this.invalidFields = props?.invalidFields;
  }

  static createFromHttpException(error: HttpException): AplicationProblem {
    const title = error.constructor.name;
    const status = error.getStatus();
    const detail = error.message;
    return new AplicationProblem({ title, status, detail });
  }

  static createFromError(error: Error): AplicationProblem {
    const title = error.constructor.name;
    const detail = error.message;
    return new AplicationProblem({
      title,
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      detail,
    });
  }

  static createFromBaseException(error: BaseException): AplicationProblem {
    const title = error.constructor.name;
    const { message } = error.toJSON();
    const status = AplicationProblem.aplicationStatusToHttp(error.code);

    if (error instanceof InvalidRequestBodyException) {
      return new AplicationProblem({
        title,
        detail: message,
        status,
        invalidFields: error.invalidFields,
      });
    }
    return new AplicationProblem({ title, detail: message, status });
  }

  static aplicationStatusToHttp(code: string): number {
    if (code === Status.UNAUTHORIZED) return HttpStatus.UNAUTHORIZED;
    if (code === Status.INVALID_REQUEST) return HttpStatus.BAD_REQUEST;
    if (code === Status.SERVICE_UNAVAILABLE)
      return HttpStatus.SERVICE_UNAVAILABLE;

    return HttpStatus.INTERNAL_SERVER_ERROR;
  }

  toJSON() {
    return {
      status: this.status,
      title: this.title,
      detail: this.detail,
      type: this.type,
      invalidFields: this?.invalidFields,
    };
  }
}

type InvalidFields = {
  field: string;
  reason: string;
};
