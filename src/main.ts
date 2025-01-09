import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ServiceExceptionToHttpExceptionFilter } from './config/excpetion-filter';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalFilters(new ServiceExceptionToHttpExceptionFilter());
    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
