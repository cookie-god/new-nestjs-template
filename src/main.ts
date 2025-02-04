import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { setupSwagger } from './config/swagger/swagger.config';
import { GlobalExceptionFilter } from './config/excpetion-filter';
import { logger } from './config/logger/logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useLogger(logger);
  setupSwagger(app);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
