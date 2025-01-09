import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ServiceExceptionToHttpExceptionFilter } from './config/excpetion-filter';
import { setupSwagger } from './config/swagger/swagger.config';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalFilters(new ServiceExceptionToHttpExceptionFilter());
    setupSwagger(app);
    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
