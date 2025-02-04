import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../users/user.service';
import { User } from '../users/schema/user.schema';
import { LoginUserDto } from './dto/login-user-dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Email not found');
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    if (user && (await user.comparePassword(password))) {
      return user;
    }
    return null;
  }

  login(loginUserDto: LoginUserDto) {
    const payload = { email: loginUserDto.email, sub: loginUserDto.id };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: loginUserDto.id,
        email: loginUserDto.email,
        username: loginUserDto.username,
      },
    };
  }
}
