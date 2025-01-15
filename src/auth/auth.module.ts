import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { KakaoStrategy } from '../config/kakao/kakao.strategy';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [HttpModule],
  controllers: [AuthController],
  providers: [AuthService, KakaoStrategy],
})
export class AuthModule {}
