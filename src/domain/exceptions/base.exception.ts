export interface SerializedException<T = unknown> {
  message: string;
  code: string;
  stack?: string;
  metadata?: T;
}

export abstract class BaseException extends Error {
  constructor(message: string, readonly metadata?: unknown) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
  }

  abstract code: string;

  toJSON<T>(): SerializedException<T> {
    return {
      message: this.message,
      code: this.code,
      stack: this.stack,
      metadata: this.metadata as T,
    };
  }
}

export enum Status {
  OK = 'OK',
  UNAUTHORIZED = 'UNAUTHORIZED',
  NOT_FOUND = 'NOT_FOUND',
  INVALID_REQUEST = 'INVALID_REQUEST',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE = 'service unavailable',
}
export enum Message {
  OK = 'Ok',
  UNAUTHORIZED = 'Unauthorized',
  NOT_FOUND = 'Not found',
  INVALID_REQUEST = 'Invalid request',
  INTERNAL_ERROR = 'Internal error',
  SERVICE_UNAVAILABLE = 'Service unavailable',
}
