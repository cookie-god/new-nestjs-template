import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { KakaoAuthGuard } from '../config/kakao/kakao-auth.guard';
import { ApiResponse } from '@nestjs/swagger';
import { PostUsersResponseDto } from '../users/dto/response/post-users.response.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @UseGuards(KakaoAuthGuard)
    @Get('kakao')
    async postLogin() {}

    @ApiResponse({
        status: 200,
        description: 'success',
        type: PostUsersResponseDto,
    })
    @Get('kakao/callback')
    async postKakaoCallback(
        @Query('code') kakaoAuthResCode: string,
    ): Promise<PostUsersResponseDto> {
        return this.authService.retrieveAccessToken(kakaoAuthResCode);
    }
}
