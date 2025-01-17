import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

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
        throw new UnauthorizedException('JWT 토큰이 만료되었습니다.');
      } else if (info?.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('JWT 토큰이 유효하지 않습니다.');
      } else if (err?.message === 'NotExistUserException') {
        console.log('check');
        throw new UnauthorizedException('존재하지 않는 사용자입니다.');
      }
      throw err || new UnauthorizedException('JWT 토큰이 존재하지 않습니다.');
    }
    return user;
  }
}
