import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from '../../user/dtos/user.dto';
import { TokenPayloadDto } from './token-payload.dto';

export class LoginPayloadDto {
  @ApiProperty({ name: 'user', type: UserDto, required: true })
  user: UserDto;

  @ApiProperty({ name: 'token', type: TokenPayloadDto, required: true })
  token: TokenPayloadDto;

  constructor(user: UserDto, token: TokenPayloadDto) {
    this.user = user;
    this.token = token;
  }
}
