import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ExpiredRefreshTokenException,
  InvalidRefreshTokenException,
  NotExistRefreshTokenException,
  NotExistUserException,
} from 'src/config/exception/service.exception';

@Injectable()
export class JwtRefreshTokenGuard extends AuthGuard('refresh_token') {
  constructor() {
    super();
  }

  // 인증 우회 로직 추가
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | any {
    const request = context.switchToHttp().getRequest();
    console.log('Authorization Header:', request.headers.authorization); // 🔍 헤더 로그 추가
    return super.canActivate(context);
  }

  handleRequest<TUser = any>(
    err: any,
    user: any,
    info: any,
    context: ExecutionContext,
    status?: any,
  ): TUser {
    if (err || !user) {
      // 커스텀 예외 처리 (예: NotExistUserException)
      if (info?.name === 'TokenExpiredError') {
        throw ExpiredRefreshTokenException();
      } else if (info?.name === 'JsonWebTokenError') {
        throw InvalidRefreshTokenException();
      } else if (user === undefined) {
        throw NotExistUserException();
      }
      throw NotExistRefreshTokenException();
    }
    return user;
  }
}
