import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserInfo } from 'src/entity/user.entity';

export const CurrentUser = createParamDecorator(
  (data, ctx: ExecutionContext): UserInfo => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  },
);
