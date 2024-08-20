import {ApiProperty} from '@nestjs/swagger';
import {IsNumber, IsString} from 'class-validator';

export class TokenPayloadDto {
  @IsNumber()
  @ApiProperty({name: 'expiresIn', type: Number, required: true})
  expiresIn: number;

  @IsString()
  @ApiProperty({name: 'accessToken', type: String, required: true})
  accessToken: string;

  constructor(data: {expiresIn: number; accessToken: string}) {
    this.expiresIn = data.expiresIn;
    this.accessToken = data.accessToken;
  }
}
