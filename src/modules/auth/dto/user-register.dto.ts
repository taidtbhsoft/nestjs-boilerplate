import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, Length } from 'class-validator';

export class UserRegisterDto {
  @IsString()
  @ApiProperty({ name: 'firstName', type: String, required: true })
  readonly firstName!: string;

  @IsString()
  @ApiProperty({ name: 'lastName', type: String, required: true })
  readonly lastName!: string;

  @IsEmail()
  @ApiProperty({ name: 'email', type: String, required: true })
  readonly email!: string;

  @IsString()
  @ApiProperty({ name: 'password', type: String, required: true, minLength: 6 })
  @Length(6)
  readonly password!: string;

  @IsString()
  @ApiProperty({ name: 'phone', type: String, required: false, minLength: 10 })
  @Length(10)
  @IsOptional()
  phone?: string;
}
