/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsNumber, IsString } from 'class-validator';
export class LoginUserDto {
  @IsNumber({})
  id: string;
  @IsString()
  email: string;
  @IsString()
  password: string;
  @IsString()
  username: string;
}
