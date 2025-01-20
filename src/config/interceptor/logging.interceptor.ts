import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body, query, params } = request;
    const startTime = Date.now();

    console.log(`[Request] ${method} ${url}`);
    console.log(`[Query Params]:`, query);
    console.log(`[Path Variables]:`, params);
    console.log(`[Body]:`, body);

    return next.handle().pipe(
      tap((data) => {
        const response = context.switchToHttp().getResponse();
        const statusCode = response.statusCode;
        const duration = Date.now() - startTime;

        console.log(
          `[Response] ${method} ${url} - Status: ${statusCode} - Time: ${duration}ms`,
        );
        console.log(`[Response Body]:`, data);
      }),
    );
  }
}
