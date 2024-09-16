import {Injectable, NotFoundException} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';

import type {RoleType} from '@constants';
import {TokenType} from '@constants';
import {validateHash} from '@common/utils';
import {AppConfigService} from '@config/app.config';
import {UserEntity} from '@common/entities/user.entity';
import {UserService} from '@modules/user/user.service';
import {TokenPayloadDto} from './dto/token-payload.dto';
import type {UserLoginDto} from './dto/user-login.dto';
import {TokenEntity} from '@/common/entities/token.entity';
import {DBNameConnections} from '@/common/constants/db-name';
import {Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: AppConfigService,
    private userService: UserService,
    @InjectRepository(TokenEntity, DBNameConnections.DEFAULT)
    private tokenRepository: Repository<TokenEntity>
  ) {}

  async createAccessToken(data: {
    role: RoleType;
    userId: string;
    isRemember: boolean;
  }): Promise<TokenPayloadDto> {
    const token = await this.jwtService.signAsync({
      userId: data.userId,
      type: TokenType.ACCESS_TOKEN,
      role: data.role,
      isRemember: data.isRemember,
    });

    await this.tokenRepository.save({
      token,
      userId: data.userId,
      exp: this.jwtService.decode(token).exp,
    });
    return new TokenPayloadDto({
      expiresIn: this.configService.authConfig.jwtExpirationTime,
      accessToken: token,
    });
  }

  async validateUser(userLoginDto: UserLoginDto): Promise<UserEntity> {
    const user = await this.userService.findOne({
      userName: userLoginDto.userName,
      unitCode: userLoginDto.unitCode,
    });

    const isPasswordValid = await validateHash(
      userLoginDto.password,
      user?.password
    );

    if (!isPasswordValid) {
      throw new NotFoundException('error.userNotFound');
    }

    return user!;
  }

  deleteTokenByToken(token: string, userId: string) {
    this.tokenRepository.delete({token, userId});
  }

  cleanUpTokens() {
    // CleanUp token expired
    const exp = Date.now();
    this.tokenRepository
      .createQueryBuilder('token')
      .delete()
      .where('exp * 1000 <= :exp', {exp})
      .execute();
  }

  getToken(token: string) {
    return this.tokenRepository.findOneBy({token});
  }
}
