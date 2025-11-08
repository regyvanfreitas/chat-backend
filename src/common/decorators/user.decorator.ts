import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    if (typeof user === 'object' && 'sub' in user) {
      return Number(user.sub);
    }

    throw new Error('User not found in request');
  },
);
