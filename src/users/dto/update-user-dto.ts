/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsNumber, IsString } from 'class-validator';
export class UpdateUserDto {
  @IsNumber({})
  id: number;
  @IsString()
  username: string;
  @IsString()
  email: string;
}
