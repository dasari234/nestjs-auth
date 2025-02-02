import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private UsersService: UsersService,
  ) {
    const jwtSecret = configService.get<string>('JWT_SECRET');

    if (typeof jwtSecret !== 'string') {
      throw new UnauthorizedException('JWT_SECRET is not defined.');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  async validate(payload: any) {
    const user = await this.UsersService.findOne(payload.sub);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user; // Attach the user to the request object
  }
}
