import {ApiProperty} from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UserLoginDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({name: 'unitCode', type: String, required: true})
  readonly unitCode!: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({name: 'userName', type: String, required: true})
  readonly userName!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(15)
  @ApiProperty({name: 'password', type: String, required: true})
  readonly password!: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({name: 'isRemember', type: Boolean, required: false})
  readonly isRemember?: boolean;
}
