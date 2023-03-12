import {
  ArgumentsHost,
  ExceptionFilter as NestExceptionFilter,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

import { AplicationProblem, HttpErrorResponse } from '../aplication-problem';

export abstract class ExceptionFilter implements NestExceptionFilter {
  constructor(private readonly logger: Logger) {}

  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const aplicationProblem = this.createAplicationProblem(exception);

    this.logger.error(
      {
        ...aplicationProblem,
        stack: exception.stack,
      },
      'CONTROLLER',
    );

    return HttpErrorResponse.send(response, aplicationProblem);
  }
  protected abstract createAplicationProblem(
    exception: unknown,
  ): AplicationProblem;
}
