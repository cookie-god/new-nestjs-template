import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { PostUsersResponseDto } from './dto/response/post-users.response.dto';
import { PostKakaoLoginTestRequestDto } from './dto/request/post-kakao-login-test-request.dto';
import { PostKakaoLoginRequestDto } from './dto/request/post-kakao-login-request.dto';
import { PostKakaoLoginResponseDto } from './dto/response/post-kakao-login-response.dto';
import { KakaoLoginSwaggerDecorator } from './auth-swagger.decorator';
import { plainToInstance } from 'class-transformer';
import { CommonResponse } from 'src/config/response/common.response';
import { KakaoAuthGuard } from 'src/config/kakao/kakao-auth.guard';

@ApiTags('AUTH')
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

  @KakaoLoginSwaggerDecorator()
  @Post('kakao/login')
  async postKakaoLogin(
    @Body() postKakaoLoginRequestDto: PostKakaoLoginRequestDto,
  ): Promise<CommonResponse<PostKakaoLoginResponseDto>> {
    return plainToInstance(CommonResponse<PostKakaoLoginResponseDto>, {
      message: 'SUCCESS',
      status: 200,
      data: await this.authService.kakaoLogin(postKakaoLoginRequestDto),
    });
  }
}
