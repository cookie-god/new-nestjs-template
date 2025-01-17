import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PostKakaoLoginResponseDto } from './dto/response/post-kakao-login-response.dto';

export function KakaoLoginSwaggerDecorator() {
  return applyDecorators(
    ApiOperation({
      summary: '카카오 로그인 API',
      description:
        '카카오 로그인을 통해서 기존 회원은 로그인, 기존 회원이 아니면 회원가입 처리를 합니다. 회원가입시 알림시간은 null, 목표 페이지는 0으로 초기화 됩니다.',
    }),
    ApiResponse({
      status: 200,
      description: 'success',
      type: PostKakaoLoginResponseDto,
    }),
    ApiResponse({
      status: 500,
      description: '내부 서버 오류',
      schema: {
        example: {
          status: '500',
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An unexpected error occurred on the server.',
        },
      },
    }),
  );
}
