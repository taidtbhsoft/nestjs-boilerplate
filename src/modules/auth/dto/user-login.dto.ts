import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class UserLoginDto {
  @IsEmail()
  @ApiProperty({ name: 'email', type: String, required: true })
  readonly email!: string;

  @IsString()
  @ApiProperty({ name: 'password', type: String, required: true })
  readonly password!: string;
}
