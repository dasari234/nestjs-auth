/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsString, IsOptional, MinLength } from 'class-validator';

export class UpdateTenantInfoDto {
  @IsString()
  @IsOptional()
  tenantName?: string;

  @IsString()
  @MinLength(10, { message: 'API key must be at least 10 characters long' })
  @IsOptional()
  apiKey?: string;

  @IsString()
  @IsOptional()
  dbName?: string;
}
