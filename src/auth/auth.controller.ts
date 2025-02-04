import {
  Controller,
  Post,
  UseGuards,
  Body,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { LoginUserDto } from './dto/login-user-dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    try {
      const user: any = await this.authService.validateUser(
        loginUserDto.email,
        loginUserDto.password,
      );
      return this.authService.login(user);
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw new UnauthorizedException(error.message);
      }
      throw error;
    }
  }
}
