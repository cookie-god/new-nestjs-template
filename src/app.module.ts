import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ServiceExceptionToHttpExceptionFilter } from './config/excpetion-filter';
import { APP_FILTER } from '@nestjs/core';
import { GlobalExceptionFilter } from './config/excpetion-filter/global.exception.filter';
import { ConfigModule } from '@nestjs/config';
import * as process from 'node:process';
import { AuthModule } from './auth/auth.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: `src/env/.${process.env.NODE_ENV}.env`,
            isGlobal: true,
        })
        , UsersModule, AuthModule],
    controllers: [AppController],
    providers: [
        {
            provide: APP_FILTER,
            useClass: ServiceExceptionToHttpExceptionFilter,
        },
        {
            provide: APP_FILTER,
            useClass: GlobalExceptionFilter,
        },
        AppService
    ],
})
export class AppModule {}
