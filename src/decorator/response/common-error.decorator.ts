import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import {
  DB_SERVER_ERROR,
  INTERNAL_SERVER_ERROR,
} from 'src/config/exception/error-code/error.code';

export function CommonErrorResponses() {
  return applyDecorators(
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
