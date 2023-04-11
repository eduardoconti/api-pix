import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

import {
  InvalidTokenException,
  TokenExpiredException,
  UnauthorizedException,
} from '@infra/exceptions';

@Injectable()
export class GqlAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext): any {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }

  handleRequest<D>(err: any, user: D, info: any) {
    if (info) {
      const { name } = info;
      switch (name) {
        case 'JsonWebTokenError':
          throw new InvalidTokenException();
        case 'TokenExpiredError':
          throw new TokenExpiredException();
        case 'NotBeforeError':
          throw new UnauthorizedException();
      }
    }

    if (!user || err) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
