import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';

import { SnakeNamingStrategy } from '../common/snake-naming.strategy';
import { UserEntity } from '../modules/user/user.entity';
import { UserSubscriber } from '../modules/user/user-subscriber';
import {
  DB_DATABASE,
  DB_HOST,
  DB_PASSWORD,
  DB_PORT,
  DB_USERNAME,
  ENABLE_ORM_LOGS,
  NODE_ENV,
} from './env.config';
import { DBNameConnections } from '../common/constants/db-name';

const isTest = NODE_ENV === 'test';

export const postgresOptions: TypeOrmModuleOptions = {
  type: 'postgres',
  host: DB_HOST,
  port: DB_PORT,
  username: DB_USERNAME,
  password: DB_PASSWORD,
  migrationsRun: true,
  logging: ENABLE_ORM_LOGS,
  namingStrategy: new SnakeNamingStrategy(),
  synchronize: true,
  keepConnectionAlive: !isTest,
  dropSchema: isTest,
};

export const postgresDefault = (): TypeOrmModuleOptions => {
  const entities = [UserEntity];
  //   const migrations = [__dirname + '/../../database/default/migrations/*{.ts,.js}'];

  return {
    ...postgresOptions,
    name: DBNameConnections.DEFAULT,
    // migrations,
    entities,
    database: DB_DATABASE,
    subscribers: [UserSubscriber],
  };
};

export const initDBModules = [
  TypeOrmModule.forRootAsync({
    useFactory: postgresDefault,
    dataSourceFactory: (options) => {
      if (!options) {
        throw new Error('Invalid options passed');
      }

      return Promise.resolve(
        addTransactionalDataSource(new DataSource(options)),
      );
    },
  }),
];
