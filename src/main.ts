import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { Logger } from '@nestjs/common';
import { DatabaseExceptionFilter } from './filters/database-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Swagger
  const config = new DocumentBuilder().build();
  const documentFactorty = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactorty);
  //
  app.useGlobalFilters(
    new HttpExceptionFilter(),
    new DatabaseExceptionFilter(),
  );
  await app.listen(process.env.PORT ?? 3000);
  Logger.log('Application is running on http://localhost:3000');
}
bootstrap();
