import { BcryptModule } from './bcrypt/bcrypt.module';
import { BaseService } from './service/base.service';
import * as process from 'node:process';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './config/interceptor/logging.interceptor';
import { UsersModule } from './domain/users/users.module';
import { AuthModule } from './domain/auth/auth.module';

@Module({
  imports: [
    BcryptModule,
    UsersModule,
    AuthModule,
    ConfigModule.forRoot({
      envFilePath: `src/env/.${process.env.NODE_ENV}.env`,
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: 3306,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      logging: true,
      synchronize: false,
      extra: {
        supportBigNumbers: true,
        bigNumberStrings: false,
      },
    }),
  ],
  controllers: [AppController],
  providers: [
    BaseService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    AppService,
  ],
})
export class AppModule {}
