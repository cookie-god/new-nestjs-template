import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { FAIL_SERVICE_CALL } from 'src/config/exception/error-code/error.code';

export function CommonServiceCallErrorResponses() {
  return applyDecorators(
    ApiResponse({
      status: FAIL_SERVICE_CALL.code,
      description: FAIL_SERVICE_CALL.message,
      schema: {
        example: {
          status: FAIL_SERVICE_CALL.status,
          code: FAIL_SERVICE_CALL.code,
          message: FAIL_SERVICE_CALL.message,
        },
      },
    }),
  );
}
