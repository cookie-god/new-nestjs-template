import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ServiceExceptionToHttpExceptionFilter } from './config/excpetion-filter';
import { APP_FILTER } from '@nestjs/core';
import { GlobalExceptionFilter } from './config/excpetion-filter/global.exception.filter';

@Module({
    imports: [UsersModule],
    controllers: [AppController],
    providers: [AppService, {
        provide: APP_FILTER,
        useClass: ServiceExceptionToHttpExceptionFilter
    }, {
        provide: APP_FILTER,
        useClass: GlobalExceptionFilter
    }],
})
export class AppModule {}
