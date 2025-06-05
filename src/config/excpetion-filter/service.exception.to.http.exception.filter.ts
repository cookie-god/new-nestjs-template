import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';
import * as apm from 'elastic-apm-node';
import { ServiceException } from '../exception/service.exception';
import {
  ErrorCode,
  INTERNAL_SERVER_ERROR,
  NOT_EXIST_USER,
} from '../exception/error-code/error.code';
import { logger } from '../logger/logger';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // APM에 에러로 수동 전송
    if (exception instanceof Error) {
      apm.captureError(exception);
    } else {
      apm.captureError(String(exception));
    }

    if (exception instanceof ServiceException) {
      // 서비스에서 발생한 에러인 경우
      const status = exception.errorCode.status;
      const code = exception.errorCode.code;

      // 로깅 추가
      logger.error(`ServiceException 발생: ${exception.message}`, {
        code,
        status,
        stack: exception.stack,
      });
      response
        .status(status)
        .json({ status: status, code: code, message: exception.message });
    } else if (exception instanceof UnauthorizedException) {
      const errorCode: ErrorCode = NOT_EXIST_USER;
      const status = errorCode.status;
      const code = errorCode.code;

      // 로깅 추가
      logger.error(`UnauthorizedException 발생: ${exception.message}`, {
        code,
        status,
        stack: exception.stack,
      });
      response
        .status(status)
        .json({ status: status, code: code, message: exception.message });
    } else {
      // 예상치 못한 에러가 발생한 경우
      const errorCode: ErrorCode = INTERNAL_SERVER_ERROR;
      const status = errorCode.status;
      const code = errorCode.code;

      // 예상치 못한 에러도 로깅 추가
      logger.error(
        `Unhandled Exception 발생: ${
          exception instanceof Error ? exception.message : String(exception)
        }`,
        {
          code,
          status,
          stack: exception instanceof Error ? exception.stack : 'no stack',
        },
      );
      response
        .status(status)
        .json({ status: status, code: code, message: errorCode.message });
    }
  }
}
