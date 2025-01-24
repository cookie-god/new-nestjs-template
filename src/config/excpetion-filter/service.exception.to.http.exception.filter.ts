import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';

import { ServiceException } from '../exception/service.exception';
import {
  ErrorCode,
  INTERNAL_SERVER_ERROR,
  NOT_EXIST_USER,
} from '../exception/error-code/error.code';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof ServiceException) {
      // 서비스에서 발생한 에러인 경우
      const status = exception.errorCode.status;
      const code = exception.errorCode.code;
      response.status(status).json({
        status: status,
        code: code,
        message: exception.message,
      });
    } else if (exception instanceof UnauthorizedException) {
      // 예상치 못한 에러가 발생한 경우
      const errorCode: ErrorCode = NOT_EXIST_USER;
      const status = errorCode.status;
      const code = errorCode.code;

      // console.log(exception);
      response.status(status).json({
        status: status,
        code: code,
        message: exception.message,
      });
    } else {
      // 예상치 못한 에러가 발생한 경우
      const errorCode: ErrorCode = INTERNAL_SERVER_ERROR;
      const status = errorCode.status;
      const code = errorCode.code;

      // console.log(exception);
      response.status(status).json({
        status: status,
        code: code,
        message: errorCode.message,
      });
    }
  }
}
