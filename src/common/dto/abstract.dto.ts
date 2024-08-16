import { IsDate, IsString } from 'class-validator';
import type { AbstractEntity } from '../abstract.entity';
import { ApiProperty } from '@nestjs/swagger';

export class AbstractDto {
  @IsString()
  @ApiProperty({ name: 'id', type: String, required: true })
  id!: string;

  @IsDate()
  @ApiProperty({ name: 'createdAt', type: Date, required: true })
  createdAt!: Date;

  @IsDate()
  @ApiProperty({ name: 'updatedAt', type: Date, required: true })
  updatedAt!: Date;

  constructor(entity: AbstractEntity, options?: { excludeFields?: boolean }) {
    if (!options?.excludeFields) {
      this.id = entity.id;
      this.createdAt = entity.createdAt;
      this.updatedAt = entity.updatedAt;
    }
  }
}
