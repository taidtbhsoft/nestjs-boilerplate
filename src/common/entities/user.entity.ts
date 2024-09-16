import {Column, Entity, OneToMany, VirtualColumn} from 'typeorm';

import {AbstractEntity} from './abstract.entity';
import {RoleType} from '@constants';
import {UseDto} from '@common/decorators';
import type {UserDtoOptions} from '@modules/user/dtos/user.dto';
import {UserDto} from '@modules/user/dtos/user.dto';
import {StatusType} from '../constants/status-type';
import {TokenEntity} from './token.entity';

@Entity({name: 'users'})
@UseDto(UserDto)
export class UserEntity extends AbstractEntity<UserDto, UserDtoOptions> {
  @Column({nullable: true, type: 'varchar'})
  firstName!: string | null;

  @Column({nullable: true, type: 'varchar'})
  lastName!: string | null;

  @Column({type: 'enum', enum: RoleType, default: RoleType.USER})
  role!: RoleType;

  @Column({unique: true, nullable: false, type: 'varchar'})
  email!: string | null;

  @Column({nullable: true, type: 'varchar'})
  password!: string | null;

  @Column({nullable: true, type: 'varchar'})
  phone!: string | null;

  @Column({nullable: true, type: 'varchar'})
  avatar!: string | null;

  @Column({type: 'enum', enum: StatusType, default: StatusType.ACTIVE})
  status!: StatusType;

  @Column({unique: true, nullable: false, type: 'varchar'})
  userName!: string | null;

  @Column({nullable: false, type: 'varchar'})
  unitCode!: string | null;

  @VirtualColumn({
    query: alias =>
      `SELECT CONCAT(${alias}.first_name, ' ', ${alias}.last_name)`,
  })
  fullName!: string;

  @OneToMany(() => TokenEntity, tokenEntity => tokenEntity.user, {
    onDelete: 'CASCADE',
  })
  tokens?: TokenEntity[];
}
