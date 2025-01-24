import { applyDecorators } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { PostKakaoLoginResponseDto } from './dto/response/post-kakao-login-response.dto';
import { CommonResponse } from 'src/config/response/common.response';
import { INTERNAL_SERVER_ERROR } from 'src/config/exception/error-code/error.code';

export function KakaoLoginSwaggerDecorator() {
  return applyDecorators(
    ApiOperation({
      summary: '카카오 로그인 API',
      description:
        '카카오 로그인을 통해서 기존 회원은 로그인, 기존 회원이 아니면 회원가입 처리를 합니다. 회원가입시 알림시간은 null, 목표 페이지는 0으로 초기화 됩니다.',
    }),
    ApiExtraModels(CommonResponse, PostKakaoLoginResponseDto),
    ApiResponse({
      status: 2000,
      description: '요청 성공',
      schema: {
        allOf: [
          { $ref: getSchemaPath(CommonResponse) },
          {
            properties: {
              data: { $ref: getSchemaPath(PostKakaoLoginResponseDto) },
            },
          },
        ],
      },
    }),
    ApiResponse({
      status: INTERNAL_SERVER_ERROR.code,
      description: INTERNAL_SERVER_ERROR.message,
      schema: {
        example: {
          status: INTERNAL_SERVER_ERROR.status,
          code: INTERNAL_SERVER_ERROR.code,
          message: INTERNAL_SERVER_ERROR.message,
        },
      },
    }),
  );
}
