// src/filters/http-exception.filter.ts
import * as winston from 'winston';
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = winston.createLogger({
    level: 'error',
    format: winston.format.json(),
    transports: [
      new winston.transports.File({
        filename: 'logs/error.log',
        level: 'error',
      }),
    ],
  });

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    // Log the error to a file
    this.logger.error({
      status,
      message,
      path: request.url,
      timestamp: new Date().toISOString(),
      stack: exception instanceof Error ? exception.stack : '',
    });

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: message,
    });
  }
}
