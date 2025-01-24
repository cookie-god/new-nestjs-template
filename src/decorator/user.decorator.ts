import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserInfo } from 'src/entity/user.entity';

export const User = createParamDecorator(
  (data, ctx: ExecutionContext): UserInfo => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  },
);
