import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ExpiredJWTException,
  InvalidJWTException,
  NotExistJWTException,
  NotExistUserException,
} from 'src/config/exception/service.exception';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
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
