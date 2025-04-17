import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AccessPayload } from '../interface/access-payload.interface';
import { NotExistUserException } from 'src/config/exception/service.exception';
import { AuthService } from '../auth.service';
import { SecretAccessPayload } from '../interface/secret-access-payload.interface';
import { BcryptService } from '../../../bcrypt/bcrypt.service';

@Injectable()
export class JwtAccessTokenStrategy extends PassportStrategy(
  Strategy,
  'access_token',
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
    private readonly bcryptService: BcryptService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('ACCESS_TOKEN_SECRET_KEY'),
    });
  }

  async validate(secretAccessPayload: SecretAccessPayload) {
    const payload: AccessPayload = {
      id: this.bcryptService.decryptNumber(secretAccessPayload.id),
    };
    const user = await this.authService.retrieveUser(payload.id);
    if (!user) {
      throw NotExistUserException();
    }
    return user;
  }
}
