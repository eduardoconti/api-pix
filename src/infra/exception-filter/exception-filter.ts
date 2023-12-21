import {
  ArgumentsHost,
  BadRequestException,
  ExceptionFilter as NestExceptionFilter,
  Logger,
} from '@nestjs/common';
import { GqlContextType } from '@nestjs/graphql';
import { Response } from 'express';
import * as Sentry from '@sentry/node';
import { AplicationProblem, HttpErrorResponse } from '../aplication-problem';

export abstract class ExceptionFilter implements NestExceptionFilter {
  constructor(private readonly logger: Logger) {}

  catch(exception: Error, host: ArgumentsHost) {
    Sentry.captureException(exception)
    if (host.getType() === 'http') {
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

    if (host.getType<GqlContextType>() === 'graphql') {
      return new BadRequestException(exception.message);
    }
  }
  protected abstract createAplicationProblem(
    exception: unknown,
  ): AplicationProblem;
}
