import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { logger } from '../logger/logger';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body, query, params } = request;
    const startTime = Date.now();

    logger.log(
      'info',
      '=====================================================================================================',
    );
    logger.log('info', `[Request] ${method} ${url}`);
    logger.log('info', `[Query Params]:`, query);
    logger.log('info', `[Path Variables]:`, params);
    logger.log('info', `[Body]:`, body);

    return next.handle().pipe(
      tap((data) => {
        const response = context.switchToHttp().getResponse();
        const statusCode = response.statusCode;
        const duration = Date.now() - startTime;

        logger.log(
          'info',
          `[Response] ${method} ${url} - Status: ${statusCode} - Time: ${duration}ms`,
        );
        logger.log('info', `[Response Body]:`, data);
        logger.log(
          'info',
          '=====================================================================================================\n',
        );
      }),
    );
  }
}
