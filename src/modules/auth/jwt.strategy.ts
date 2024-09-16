import {Injectable, UnauthorizedException} from '@nestjs/common';
import {PassportStrategy} from '@nestjs/passport';
import {ExtractJwt, Strategy} from 'passport-jwt';

import type {RoleType} from '@constants';
import {TokenType} from '@constants';
import {AppConfigService} from '@config/app.config';
import {UserEntity} from '@common/entities/user.entity';
import {UserService} from '@modules/user/user.service';
import {Request} from 'express';
import {AuthService} from './auth.service';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: AppConfigService,
    private userService: UserService,
    private authService: AuthService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.authConfig.publicKey,
      passReqToCallback: true,
    });
  }

  async validate(
    req: Request,
    args: {
      userId: string;
      role: RoleType;
      type: TokenType;
    }
  ): Promise<UserEntity> {
    if (args.type !== TokenType.ACCESS_TOKEN) {
      throw new UnauthorizedException();
    }
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    if (!token) {
      throw new UnauthorizedException();
    }
    const tokenData = await this.authService.getToken(token);
    if (tokenData?.userId !== args.userId) {
      throw new UnauthorizedException('Token invalid');
    }
    const user = await this.userService.findOne({
      id: args.userId as never,
      role: args.role,
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
