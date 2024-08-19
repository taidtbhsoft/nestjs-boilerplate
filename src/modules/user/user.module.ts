import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';

import {UserController} from './user.controller';
import {UserEntity} from '@common/entities/user.entity';
import {UserService} from './user.service';
import {DBNameConnections} from '@constants/db-name';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity], DBNameConnections.DEFAULT)],
  controllers: [UserController],
  exports: [UserService],
  providers: [UserService],
})
export class UserModule {}
