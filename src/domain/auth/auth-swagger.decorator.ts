import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { CommonResponse } from 'src/config/response/common.response';
import {
  DUPLICATE_EMAIL,
  DUPLICATE_NICKNAME,
  EXPIRED_REFRESH_TOKEN,
  INVALID_EMAIL,
  INVALID_NICKNAME,
  INVALID_PASSWORD,
  INVALID_REFRESH_TOKEN,
  NOT_EXIST_EMAIL,
  NOT_EXIST_NICKNAME,
  NOT_EXIST_PASSWORD,
  NOT_EXIST_REFRESH_TOKEN,
  NOT_EXIST_USER,
  NOT_MATCH_PASSWORD,
} from 'src/config/exception/error-code/error.code';
import { PostSignUpRequestDto } from './dto/request/post-sign-up-request.dto';
import { PostSignUpResponseDto } from './dto/response/post-sign-up-response.dto';
import { PostSignInResponseDto } from './dto/response/post-sign-in-response.dto';
import { PostSignInRequestDto } from './dto/request/post-sign-in-request.dto';
import { PostAccessTokenResponseDto } from './dto/response/post-refresh-token-response.dto';
import { CommonErrorResponses } from 'src/decorator/common-error.decorator';

export function PostSignUpSwaggerDecorator() {
  return applyDecorators(
    ApiOperation({
      summary: '회원 가입 API',
      description: '회원 가입을 진행하는 API 입니다.',
    }),
    ApiExtraModels(CommonResponse, PostSignUpResponseDto),
    ApiBody({ type: PostSignUpRequestDto }),
    ApiResponse({
      status: 2000,
      description: '요청 성공',
      schema: {
        allOf: [
          { $ref: getSchemaPath(CommonResponse) },
          {
            properties: {
              data: { $ref: getSchemaPath(PostSignUpResponseDto) },
            },
          },
        ],
      },
    }),
    ApiResponse({
      status: NOT_EXIST_EMAIL.code,
      description: NOT_EXIST_EMAIL.message,
      schema: {
        example: {
          status: NOT_EXIST_EMAIL.status,
          code: NOT_EXIST_EMAIL.code,
          message: NOT_EXIST_EMAIL.message,
        },
      },
    }),
    ApiResponse({
      status: INVALID_EMAIL.code,
      description: INVALID_EMAIL.message,
      schema: {
        example: {
          status: INVALID_EMAIL.status,
          code: INVALID_EMAIL.code,
          message: INVALID_EMAIL.message,
        },
      },
    }),
    ApiResponse({
      status: NOT_EXIST_PASSWORD.code,
      description: NOT_EXIST_PASSWORD.message,
      schema: {
        example: {
          status: NOT_EXIST_PASSWORD.status,
          code: NOT_EXIST_PASSWORD.code,
          message: NOT_EXIST_PASSWORD.message,
        },
      },
    }),
    ApiResponse({
      status: INVALID_PASSWORD.code,
      description: INVALID_PASSWORD.message,
      schema: {
        example: {
          status: INVALID_PASSWORD.status,
          code: INVALID_PASSWORD.code,
          message: INVALID_PASSWORD.message,
        },
      },
    }),
    ApiResponse({
      status: NOT_EXIST_NICKNAME.code,
      description: NOT_EXIST_NICKNAME.message,
      schema: {
        example: {
          status: NOT_EXIST_NICKNAME.status,
          code: NOT_EXIST_NICKNAME.code,
          message: NOT_EXIST_NICKNAME.message,
        },
      },
    }),
    ApiResponse({
      status: INVALID_NICKNAME.code,
      description: INVALID_NICKNAME.message,
      schema: {
        example: {
          status: INVALID_NICKNAME.status,
          code: INVALID_NICKNAME.code,
          message: INVALID_NICKNAME.message,
        },
      },
    }),
    ApiResponse({
      status: DUPLICATE_EMAIL.code,
      description: DUPLICATE_EMAIL.message,
      schema: {
        example: {
          status: DUPLICATE_EMAIL.status,
          code: DUPLICATE_EMAIL.code,
          message: DUPLICATE_EMAIL.message,
        },
      },
    }),
    ApiResponse({
      status: DUPLICATE_NICKNAME.code,
      description: DUPLICATE_NICKNAME.message,
      schema: {
        example: {
          status: DUPLICATE_NICKNAME.status,
          code: DUPLICATE_NICKNAME.code,
          message: DUPLICATE_NICKNAME.message,
        },
      },
    }),
    CommonErrorResponses(),
  );
}

export function PostSignInSwaggerDecorator() {
  return applyDecorators(
    ApiOperation({
      summary: '로그인 API',
      description:
        '로그인을 진행하는 API 입니다. Response로 Token을 받을 수 있습니다.',
    }),
    ApiExtraModels(CommonResponse, PostSignInResponseDto),
    ApiBody({ type: PostSignInRequestDto }),
    ApiResponse({
      status: 2000,
      description: '요청 성공',
      schema: {
        allOf: [
          { $ref: getSchemaPath(CommonResponse) },
          {
            properties: {
              data: { $ref: getSchemaPath(PostSignInResponseDto) },
            },
          },
        ],
      },
    }),
    ApiResponse({
      status: NOT_EXIST_EMAIL.code,
      description: NOT_EXIST_EMAIL.message,
      schema: {
        example: {
          status: NOT_EXIST_EMAIL.status,
          code: NOT_EXIST_EMAIL.code,
          message: NOT_EXIST_EMAIL.message,
        },
      },
    }),
    ApiResponse({
      status: INVALID_EMAIL.code,
      description: INVALID_EMAIL.message,
      schema: {
        example: {
          status: INVALID_EMAIL.status,
          code: INVALID_EMAIL.code,
          message: INVALID_EMAIL.message,
        },
      },
    }),
    ApiResponse({
      status: NOT_EXIST_PASSWORD.code,
      description: NOT_EXIST_PASSWORD.message,
      schema: {
        example: {
          status: NOT_EXIST_PASSWORD.status,
          code: NOT_EXIST_PASSWORD.code,
          message: NOT_EXIST_PASSWORD.message,
        },
      },
    }),
    ApiResponse({
      status: INVALID_PASSWORD.code,
      description: INVALID_PASSWORD.message,
      schema: {
        example: {
          status: INVALID_PASSWORD.status,
          code: INVALID_PASSWORD.code,
          message: INVALID_PASSWORD.message,
        },
      },
    }),
    ApiResponse({
      status: NOT_EXIST_USER.code,
      description: NOT_EXIST_USER.message,
      schema: {
        example: {
          status: NOT_EXIST_USER.status,
          code: NOT_EXIST_USER.code,
          message: NOT_EXIST_USER.message,
        },
      },
    }),
    ApiResponse({
      status: NOT_MATCH_PASSWORD.code,
      description: NOT_MATCH_PASSWORD.message,
      schema: {
        example: {
          status: NOT_MATCH_PASSWORD.status,
          code: NOT_MATCH_PASSWORD.code,
          message: NOT_MATCH_PASSWORD.message,
        },
      },
    }),
    CommonErrorResponses(),
  );
}

export function PostRefreshTokenSwaggerDecorator() {
  return applyDecorators(
    ApiOperation({
      summary: 'Access Token 발급 API',
      description:
        'Refresh Token을 통해 Access Token을 재발급 받는 API 입니다. header에 refresh token을 넣어서 요청주세요.',
    }),
    ApiExtraModels(CommonResponse, PostAccessTokenResponseDto),
    ApiBearerAuth('JWT'),
    ApiResponse({
      status: 2000,
      description: '요청 성공',
      schema: {
        allOf: [
          { $ref: getSchemaPath(CommonResponse) },
          {
            properties: {
              data: { $ref: getSchemaPath(PostAccessTokenResponseDto) },
            },
          },
        ],
      },
    }),
    ApiResponse({
      status: NOT_EXIST_USER.code,
      description: NOT_EXIST_USER.message,
      schema: {
        example: {
          status: NOT_EXIST_USER.status,
          code: NOT_EXIST_USER.code,
          message: NOT_EXIST_USER.message,
        },
      },
    }),
    ApiResponse({
      status: NOT_EXIST_REFRESH_TOKEN.code,
      description: NOT_EXIST_REFRESH_TOKEN.message,
      schema: {
        example: {
          status: NOT_EXIST_REFRESH_TOKEN.status,
          code: NOT_EXIST_REFRESH_TOKEN.code,
          message: NOT_EXIST_REFRESH_TOKEN.message,
        },
      },
    }),
    ApiResponse({
      status: INVALID_REFRESH_TOKEN.code,
      description: INVALID_REFRESH_TOKEN.message,
      schema: {
        example: {
          status: INVALID_REFRESH_TOKEN.status,
          code: INVALID_REFRESH_TOKEN.code,
          message: INVALID_REFRESH_TOKEN.message,
        },
      },
    }),
    ApiResponse({
      status: EXPIRED_REFRESH_TOKEN.code,
      description: EXPIRED_REFRESH_TOKEN.message,
      schema: {
        example: {
          status: EXPIRED_REFRESH_TOKEN.status,
          code: EXPIRED_REFRESH_TOKEN.code,
          message: EXPIRED_REFRESH_TOKEN.message,
        },
      },
    }),
    CommonErrorResponses(),
  );
}
