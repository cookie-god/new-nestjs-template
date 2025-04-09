import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import {
  EXPIRED_ACCESS_TOKEN,
  NOT_EXIST_ACCESS_TOKEN,
  INTERNAL_SERVER_ERROR,
  INVALID_ACCESS_TOKEN,
  NOT_EXIST_USER,
  DB_SERVER_ERROR,
} from 'src/config/exception/error-code/error.code';

export function CommonJwtErrorResponses() {
  return applyDecorators(
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
      status: EXPIRED_ACCESS_TOKEN.code,
      description: EXPIRED_ACCESS_TOKEN.message,
      schema: {
        example: {
          status: EXPIRED_ACCESS_TOKEN.status,
          code: EXPIRED_ACCESS_TOKEN.code,
          message: EXPIRED_ACCESS_TOKEN.message,
        },
      },
    }),
    ApiResponse({
      status: NOT_EXIST_ACCESS_TOKEN.code,
      description: NOT_EXIST_ACCESS_TOKEN.message,
      schema: {
        example: {
          status: NOT_EXIST_ACCESS_TOKEN.status,
          code: NOT_EXIST_ACCESS_TOKEN.code,
          message: NOT_EXIST_ACCESS_TOKEN.message,
        },
      },
    }),
    ApiResponse({
      status: INVALID_ACCESS_TOKEN.code,
      description: INVALID_ACCESS_TOKEN.message,
      schema: {
        example: {
          status: INVALID_ACCESS_TOKEN.status,
          code: INVALID_ACCESS_TOKEN.code,
          message: INVALID_ACCESS_TOKEN.message,
        },
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
    ApiResponse({
      status: DB_SERVER_ERROR.code,
      description: DB_SERVER_ERROR.message,
      schema: {
        example: {
          status: DB_SERVER_ERROR.status,
          code: DB_SERVER_ERROR.code,
          message: DB_SERVER_ERROR.message,
        },
      },
    }),
  );
}
