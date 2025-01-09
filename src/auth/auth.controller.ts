import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PostUsersDto } from '../users/dto/post-users.dto';
import { KakaoAuthGuard } from '../config/kakao/kakao-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @UseGuards(KakaoAuthGuard)
    @Get('kakao')
    async postLogin() {

    }

    @Get('kakao/callback')
    async postKakaoCallback(@Query('code') kakaoAuthResCode: string) {
        return this.authService.retrieveAccessToken(kakaoAuthResCode)
    }
}
