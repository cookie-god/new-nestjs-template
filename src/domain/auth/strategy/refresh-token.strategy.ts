import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import {
  InvalidRefreshTokenException,
  NotExistRefreshTokenException,
  NotExistUserException,
} from 'src/config/exception/service.exception';
import { RefreshPayload } from '../interface/refresh-payload.interface';
import { Request } from 'express';
import { AuthService } from '../auth.service';
import { UserInfo } from 'src/entity/user.entity';
import { SecretRefreshPayload } from '../interface/secret-refresh-payload.interface';
import { BcryptService } from 'src/domain/bcrypt/bcrypt.service';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'refresh_token',
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
    private readonly bcryptService: BcryptService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('REFRESH_TOKEN_SECRET_KEY'),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, SecretRefreshPayload: SecretRefreshPayload) {
    const payload: RefreshPayload = {
      id: this.bcryptService.decryptNumber(SecretRefreshPayload.id),
    };
    const authHeader = req?.headers?.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw NotExistRefreshTokenException();
    }
    const refreshToken = authHeader.split(' ')[1];
    const user: UserInfo = await this.authService.retrieveUser(payload.id);
    if (!user) {
      throw NotExistUserException();
    }
    if (!(await this.authService.compareRefreshToken(user, refreshToken))) {
      throw InvalidRefreshTokenException();
    }
    return user;
  }
}
