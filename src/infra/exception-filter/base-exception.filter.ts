import { Catch } from '@nestjs/common';

import { BaseException } from '@domain/exceptions';

import { AplicationProblem } from '../aplication-problem';
import { ExceptionFilter } from './exception-filter';

@Catch(BaseException)
export class BaseExceptionFilter extends ExceptionFilter {
  protected createAplicationProblem(exception: BaseException) {
    return AplicationProblem.createFromBaseException(exception);
  }
}
