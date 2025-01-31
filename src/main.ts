import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { Logger } from '@nestjs/common';
import { DatabaseExceptionFilter } from './filters/database-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(
    new HttpExceptionFilter(),
    new DatabaseExceptionFilter(),
  );
  await app.listen(process.env.PORT ?? 3000);
  Logger.log('Application is running on http://localhost:3000');
}
bootstrap();
