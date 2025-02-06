import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserInfo } from 'src/entity/user.entity';
import { AuthRepository } from './auth.repository';
import { JwtModule } from '@nestjs/jwt';
import { JwtAccessTokenStrategy } from './strategy/access-token.strategy';
import { JwtRefreshTokenStrategy } from './strategy/refresh-token.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserInfo]),
    JwtModule.register({ global: true }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthRepository,
    JwtAccessTokenStrategy,
    JwtRefreshTokenStrategy,
  ],
})
export class AuthModule {}
