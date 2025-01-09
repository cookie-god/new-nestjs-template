// src/common/exception-filter/index.ts
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Request, Response } from 'express';
import { ServiceException } from '../exception/service.exception';



// src/common/exception-filter/service.exception.to.http.exception.filter.ts
@Catch(ServiceException)
export class ServiceExceptionToHttpExceptionFilter implements ExceptionFilter {
    catch(exception: ServiceException, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        const request = ctx.getRequest<Request>();
        const response = ctx.getResponse<Response>();
        const status = exception.errorCode.status;
        const code = exception.errorCode.code;

        response.status(status).json({
            statusCode: status,
            code: code,
            message: exception.message,
            path: request.url,
        });
    }
}