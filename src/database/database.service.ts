import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DatabaseService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      url: this.configService.get<string>('DATABASE_URL'),
      entities: [__dirname + '/../**/*.schema{.ts,.js}'],
      synchronize: true, // Set to false in production
      logging: true,
    };
  }
}
