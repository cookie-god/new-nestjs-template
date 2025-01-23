import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import {
  ExpiredJWTException,
  InvalidJWTException,
  NotExistJWTException,
  NotExistUserException,
} from 'src/config/exception/service.exception';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  // 인증 우회 로직 추가
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | any {
    const request = context.switchToHttp().getRequest();
    const isPublic = this.reflector.get<boolean>(
      'isPublic',
      context.getHandler(),
    );
    if (isPublic) {
      const token = request.headers.authorization?.split(' ')[1];

      // JWT 토큰이 없는 경우 인증 건너뜀
      if (!token) {
        console.log('Public route without JWT, skipping authentication');
        return true;
      }
    }
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
        throw ExpiredJWTException();
      } else if (info?.name === 'JsonWebTokenError') {
        throw InvalidJWTException();
      } else if (user === undefined) {
        throw NotExistUserException();
      }
      throw NotExistJWTException();
    }
    return user;
  }
}
