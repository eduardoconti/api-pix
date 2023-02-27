import { Catch } from '@nestjs/common';

import { AplicationProblem } from '../aplication-problem';
import { ExceptionFilter } from './exception-filter';

@Catch(Error)
export class UnknownExceptionFilter extends ExceptionFilter {
  protected createAplicationProblem(exception: Error) {
    return AplicationProblem.createFromError(exception);
  }
}
