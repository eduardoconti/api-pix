import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';

import { AuthenticateOutput } from '@app/use-cases';

export const User = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    if (ctx.getType() === 'http') {
      const request = ctx.switchToHttp().getRequest();
      return request.user as AuthenticateOutput;
    }

    if (ctx.getType<GqlContextType>() === 'graphql') {
      const context = GqlExecutionContext.create(ctx);
      return context.getContext().req.user;
    }
  },
);
