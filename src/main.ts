import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { setupSwagger } from './config/swagger/swagger.config';
import { GlobalExceptionFilter } from './config/excpetion-filter';
import { CustomValidationPipe } from './pipe/custom-validation.pipe';
import * as apm from 'elastic-apm-node';

async function bootstrap() {
  apm.start({
    serviceName: process.env.ELASTIC_APM_SERVICE_NAME,
    serverUrl: process.env.ELASTIC_APM_SERVER_URL,
    environment: process.env.ELASTIC_APM_ENVIRONMENT,
  });
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new CustomValidationPipe());
  app.useGlobalFilters(new GlobalExceptionFilter());
  setupSwagger(app);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
