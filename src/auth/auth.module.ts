import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { KakaoStrategy } from '../config/kakao/kakao.strategy';
import { HttpModule } from '@nestjs/axios';

@Module({
    imports: [HttpModule],
    controllers: [AuthController],
    providers: [AuthService, KakaoStrategy],
})
export class AuthModule {}
