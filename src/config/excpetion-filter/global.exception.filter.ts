import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrorCode, INTERNAL_SERVER_ERROR } from '../exception/error-code/error.code';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        const request = ctx.getRequest<Request>();
        const response = ctx.getResponse<Response>();
        let errorCode: ErrorCode = INTERNAL_SERVER_ERROR;
        const status = errorCode.status;
        const code = errorCode.code;

        response.status(status).json({
            statusCode: status,
            code: code,
            message: errorCode.message,
            path: request.url,
        });
    }
}