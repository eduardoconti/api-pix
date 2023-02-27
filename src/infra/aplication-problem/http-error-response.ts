import { Response } from 'express';

import { AplicationProblem } from './aplication-problem';
export class HttpErrorResponse {
  static send(res: Response, aplicationProblem: AplicationProblem) {
    res.setHeader('content-type', 'aplication/problem+json');
    res.status(aplicationProblem.status).json(aplicationProblem.toJSON());
    return;
  }
}
