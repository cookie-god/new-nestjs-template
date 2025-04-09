import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  PostRefreshTokenSwaggerDecorator,
  PostSignInSwaggerDecorator,
  PostSignUpSwaggerDecorator,
} from './auth-swagger.decorator';
import { PostSignIn, PostSignUp } from './auth-validation.decorator';
import { PostSignUpRequestDto } from './dto/request/post-sign-up-request.dto';
import { CommonResponse } from 'src/config/response/common.response';
import { PostSignUpResponseDto } from './dto/response/post-sign-up-response.dto';
import { plainToClass } from 'class-transformer';
import { PostSignInResponseDto } from './dto/response/post-sign-in-response.dto';
import { PostSignInRequestDto } from './dto/request/post-sign-in-request.dto';
import { User } from 'src/decorator/user.decorator';
import { PostAccessTokenResponseDto } from './dto/response/post-refresh-token-response.dto';
import { UserInfo } from 'src/entity/user.entity';
import { ApiTags } from '@nestjs/swagger';
import { JwtRefreshTokenGuard } from './guard/refresh-token.guard';

@ApiTags('AUTH')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @PostSignUpSwaggerDecorator()
  @Post('sign-up')
  async postSignUp(
    @Body() data: PostSignUpRequestDto,
  ): Promise<CommonResponse<PostSignUpResponseDto>> {
    return plainToClass(CommonResponse<PostSignUpResponseDto>, {
      status: 201,
      data: await this.authService.createUsers(data),
    });
  }

  @PostSignInSwaggerDecorator()
  @Post('sign-in')
  async postSignIn(
    @PostSignIn() data: PostSignInRequestDto,
  ): Promise<CommonResponse<PostSignInResponseDto>> {
    return plainToClass(CommonResponse<PostSignInResponseDto>, {
      status: 201,
      data: await this.authService.login(data),
    });
  }

  @PostRefreshTokenSwaggerDecorator()
  @UseGuards(JwtRefreshTokenGuard)
  @Post('refresh')
  async postRefreshToken(
    @User() user: UserInfo,
  ): Promise<CommonResponse<PostAccessTokenResponseDto>> {
    return plainToClass(CommonResponse<PostAccessTokenResponseDto>, {
      status: 201,
      data: plainToClass(PostAccessTokenResponseDto, {
        accessToken: await this.authService.createAccessToken(user),
      }),
    });
  }
}
