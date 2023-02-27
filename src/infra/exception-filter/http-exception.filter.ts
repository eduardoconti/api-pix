import { Catch, HttpException } from '@nestjs/common';

import { AplicationProblem } from '../aplication-problem';
import { ExceptionFilter } from './exception-filter';

@Catch(HttpException)
export class HttpExceptionFilter extends ExceptionFilter {
  protected createAplicationProblem(exception: HttpException) {
    return AplicationProblem.createFromHttpException(exception);
  }
}
