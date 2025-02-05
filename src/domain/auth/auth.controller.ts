import { Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { PostSignUpSwaggerDecorator } from './auth-swagger.decorator';
import { PostSignUp } from './auth-validation.decorator';
import { PostSignUpRequestDto } from './dto/request/post-sign-up-request.dto';
import { CommonResponse } from 'src/config/response/common.response';
import { PostSignUpResponseDto } from './dto/request/post-sign-up-response.dto';
import { plainToClass } from 'class-transformer';

@ApiTags('AUTH')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @PostSignUpSwaggerDecorator()
  @Post('sign-up')
  async postSignup(
    @PostSignUp() data: PostSignUpRequestDto,
  ): Promise<CommonResponse<PostSignUpResponseDto>> {
    return plainToClass(CommonResponse<PostSignUpResponseDto>, {
      status: 201,
      data: await this.authService.createUsers(data),
    });
    // console.log(data);
  }
}
