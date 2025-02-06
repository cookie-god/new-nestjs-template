import { Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import {
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

@ApiTags('AUTH')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @PostSignUpSwaggerDecorator()
  @Post('sign-up')
  async postSignUp(
    @PostSignUp() data: PostSignUpRequestDto,
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
}
