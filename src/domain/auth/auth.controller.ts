import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { PostKakaoLoginRequestDto } from './dto/request/post-kakao-login-request.dto';
import { PostKakaoLoginResponseDto } from './dto/response/post-kakao-login-response.dto';
import { KakaoLoginSwaggerDecorator } from './auth-swagger.decorator';
import { plainToInstance } from 'class-transformer';
import { CommonResponse } from 'src/config/response/common.response';

@ApiTags('AUTH')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  async postSignup() {}
}
