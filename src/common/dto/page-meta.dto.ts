import { IsBoolean, IsNumber } from 'class-validator';
import type { PageOptionsDto } from './page-options.dto';
import { ApiProperty } from '@nestjs/swagger';

interface IPageMetaDtoParameters {
  pageOptionsDto: PageOptionsDto;
  itemCount: number;
}

export class PageMetaDto {
  @IsNumber()
  @ApiProperty({ name: 'page', type: Number, required: true })
  readonly page: number;

  @IsNumber()
  @ApiProperty({ name: 'take', type: Number, required: true })
  readonly take: number;

  @IsNumber()
  @ApiProperty({ name: 'itemCount', type: Number, required: true })
  readonly itemCount: number;

  @IsNumber()
  @ApiProperty({ name: 'itemCount', type: Number, required: true })
  readonly pageCount: number;

  @IsBoolean()
  @ApiProperty({ name: 'hasPreviousPage', type: Boolean, required: true })
  readonly hasPreviousPage: boolean;

  @IsBoolean()
  @ApiProperty({ name: 'hasNextPage', type: Boolean, required: true })
  readonly hasNextPage: boolean;

  constructor({ pageOptionsDto, itemCount }: IPageMetaDtoParameters) {
    this.page = pageOptionsDto.page;
    this.take = pageOptionsDto.take;
    this.itemCount = itemCount;
    this.pageCount = Math.ceil(this.itemCount / this.take);
    this.hasPreviousPage = this.page > 1;
    this.hasNextPage = this.page < this.pageCount;
  }
}
