import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthRepository } from '../auth.repository';
import { NotExistUserException } from 'src/config/exception/service.exception';
import { payload } from '../interface/user-payload.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authRepository: AuthRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, // 만료된 토큰 거부
      secretOrKey: process.env.JWT_SECRET_KEY,
    });
  }

  async validate(payload: payload) {
    const user = await this.authRepository.findUserById(payload.id);
    // 유저가 없거나 비활성화된 경우 예외 처리
    if (!user) {
      throw NotExistUserException();
    }

    // 요청 객체에 유저 정보를 추가 (req.user에 저장됨)
    return user;
  }
}
