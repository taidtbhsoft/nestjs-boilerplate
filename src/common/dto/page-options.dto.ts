import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { Order } from '../constants';
import { ApiProperty } from '@nestjs/swagger';

export class PageOptionsDto {
  @IsOptional()
  @ApiProperty({
    name: 'order',
    type: String,
    required: false,
    default: Order.ASC,
  })
  @IsEnum(Order, { each: true })
  readonly order: Order = Order.ASC;

  @IsNumber()
  @ApiProperty({ name: 'page', type: Number, required: false })
  readonly page: number = 1;

  @IsNumber()
  @ApiProperty({ name: 'take', type: Number, required: false })
  readonly take: number = 10;

  get skip(): number {
    return (this.page - 1) * this.take;
  }

  @IsString()
  @ApiProperty({ name: 'q', type: String, required: false })
  readonly q?: string;
}
