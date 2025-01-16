import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { KakaoStrategy } from '../config/kakao/kakao.strategy';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserInfo } from 'src/entity/user.entity';
import { AuthRepository } from './auth.repository';

@Module({
  imports: [TypeOrmModule.forFeature([UserInfo]), HttpModule],
  controllers: [AuthController],
  providers: [AuthService, AuthRepository, KakaoStrategy],
})
export class AuthModule {}
