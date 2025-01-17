import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { KakaoAuthGuard } from '../config/kakao/kakao-auth.guard';
import { AuthService } from './auth.service';
import { PostUsersResponseDto } from './dto/response/post-users.response.dto';
import { PostKakaoLoginTestRequestDto } from './dto/request/post-kakao-login-test-request.dto';
import { PostKakaoLoginRequestDto } from './dto/request/post-kakao-login-request.dto';
import { PostKakaoLoginResponseDto } from './dto/response/post-kakao-login-response.dto';
import { INTERNAL_SERVER_ERROR } from 'src/config/exception/error-code/error.code';

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
  async postKakaoLoginTest(
    @Body() postKakaoLoginTestRequest: PostKakaoLoginTestRequestDto,
  ): Promise<PostUsersResponseDto> {
    return this.authService.retrieveSnsId(postKakaoLoginTestRequest);
  }

  @ApiResponse({
    status: 200,
    description: 'success',
    type: PostKakaoLoginResponseDto,
  })
  @ApiResponse({
    description: '내부 서버 오류',
    schema: {
      example: {
        status: INTERNAL_SERVER_ERROR.status,
        code: INTERNAL_SERVER_ERROR.code,
        message: INTERNAL_SERVER_ERROR.message,
      },
    },
  })
  @Post('kakao/login')
  async postKakaoLogin(
    @Body() postKakaoLoginRequestDto: PostKakaoLoginRequestDto,
  ): Promise<PostKakaoLoginResponseDto> {
    return {
      message: 'SUCCESS',
      status: 200,
      data: await this.authService.kakaoLogin(postKakaoLoginRequestDto),
    } as PostKakaoLoginResponseDto;
  }
}
