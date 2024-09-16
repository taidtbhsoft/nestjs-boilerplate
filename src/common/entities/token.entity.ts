import {Column, Entity, JoinColumn, ManyToOne} from 'typeorm';

import {AbstractEntity} from './abstract.entity';
import {UserEntity} from './user.entity';

@Entity({name: 'tokens'})
export class TokenEntity extends AbstractEntity {
  @Column({nullable: false, type: 'varchar'})
  userId!: string;

  @Column({unique: true, nullable: false, type: 'varchar'})
  token!: string | null;

  @Column({nullable: false, type: 'bigint'})
  exp!: number;

  @ManyToOne(() => UserEntity, userEntity => userEntity.tokens, {
    cascade: true,
  })
  @JoinColumn({name: 'userId'})
  user!: UserEntity;
}
