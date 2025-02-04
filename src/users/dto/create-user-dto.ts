/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsNumber, IsString } from 'class-validator';

export class CreateUserDto {
  @IsNumber({})
  id: number;
  @IsString()
  username: string;
  @IsString()
  password: string;
  @IsString()
  email: string;
}
