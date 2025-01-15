import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

import { KakaoAuthGuard } from '../config/kakao/kakao-auth.guard';
import { PostUsersResponseDto } from '../users/dto/response/post-users.response.dto';

import { AuthService } from './auth.service';
import { PostKakaoLoginTestRequestDto } from 'src/users/dto/request/post-kakao-login-test.request.dto';
import { PostUsersRequestDto } from 'src/users/dto/request/post-users.request.dto';

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

  @Post('kakao/test')
  async postKakaoLoginTest(@Body() postKakaoLoginTestRequest: PostKakaoLoginTestRequestDto): Promise<PostUsersResponseDto> {
    return this.authService.retrieveSnsId(postKakaoLoginTestRequest);
  }
}
