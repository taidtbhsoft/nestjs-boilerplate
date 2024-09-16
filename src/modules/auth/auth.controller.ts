import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
  Version,
} from '@nestjs/common';
import {ApiOkResponse, ApiTags} from '@nestjs/swagger';

import {RoleType} from '@constants';
import {Auth, AuthUser} from '@common/decorators';
import {UserDto} from '@modules/user/dtos/user.dto';
import {UserEntity} from '@common/entities/user.entity';
import {AuthService} from './auth.service';
import {LoginPayloadDto} from './dto/login-payload.dto';
import {UserLoginDto} from './dto/user-login.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: LoginPayloadDto,
    description: 'User info with access token',
  })
  async userLogin(
    @Body() userLoginDto: UserLoginDto
  ): Promise<LoginPayloadDto> {
    const userEntity = await this.authService.validateUser(userLoginDto);

    const token = await this.authService.createAccessToken({
      userId: userEntity.id,
      role: userEntity.role,
      isRemember: userLoginDto.isRemember || false,
    });

    return new LoginPayloadDto(userEntity.toDto(), token);
  }

  @Version('1')
  @Get('me')
  @HttpCode(HttpStatus.OK)
  @Auth([RoleType.USER, RoleType.ADMIN])
  @ApiOkResponse({type: UserDto, description: 'current user info'})
  getCurrentUser(@AuthUser() user: UserEntity): UserDto {
    return user.toDto();
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @Auth()
  @ApiOkResponse({description: 'logout user'})
  async userLogout(
    @Headers('authorization') authorization: string,
    @AuthUser() user: UserEntity
  ) {
    const token = authorization.split(' ')[1];
    await this.authService.deleteTokenByToken(token, user.id);
    return {
      message: 'You have successfully logged out!',
    };
  }
}
