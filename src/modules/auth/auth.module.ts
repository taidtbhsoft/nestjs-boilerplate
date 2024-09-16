import {forwardRef, Module} from '@nestjs/common';
import {JwtModule} from '@nestjs/jwt';
import {PassportModule} from '@nestjs/passport';

import {AppConfigService} from '@config/app.config';
import {UserModule} from '../user/user.module';
import {AuthController} from './auth.controller';
import {AuthService} from './auth.service';
import {JwtStrategy} from './jwt.strategy';
import {PublicStrategy} from './public.strategy';
import {TypeOrmModule} from '@nestjs/typeorm';
import {TokenEntity} from '@/common/entities/token.entity';
import {DBNameConnections} from '@/common/constants/db-name';

@Module({
  imports: [
    forwardRef(() => UserModule),
    TypeOrmModule.forFeature([TokenEntity], DBNameConnections.DEFAULT),
    PassportModule.register({defaultStrategy: 'jwt'}),
    JwtModule.registerAsync({
      useFactory: (configService: AppConfigService) => ({
        privateKey: configService.authConfig.privateKey,
        publicKey: configService.authConfig.publicKey,
        signOptions: {
          algorithm: 'RS256',
          expiresIn: configService.getNumber('JWT_EXPIRATION_TIME'),
        },
        verifyOptions: {
          algorithms: ['RS256'],
        },
      }),
      inject: [AppConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, PublicStrategy],
  exports: [JwtModule, AuthService],
})
export class AuthModule {}
