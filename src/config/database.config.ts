import {TypeOrmModule, TypeOrmModuleOptions} from '@nestjs/typeorm';
import {DataSource} from 'typeorm';
import {addTransactionalDataSource} from 'typeorm-transactional';

import {UserEntity} from '@common/entities/user.entity';
import {UserSubscriber} from '@modules/user/user-subscriber';
import {
  DB_DATABASE,
  DB_HOST,
  DB_PASSWORD,
  DB_PORT,
  DB_USERNAME,
  ENABLE_ORM_LOGS,
  NODE_ENV,
} from './env.config';
import {DBNameConnections} from '@/common/constants/db-name';
import {TokenEntity} from '@/common/entities/token.entity';

const isTest = NODE_ENV === 'test';

export const postgresOptions: TypeOrmModuleOptions = {
  type: 'postgres',
  host: DB_HOST,
  port: DB_PORT,
  username: DB_USERNAME,
  password: DB_PASSWORD,
  migrationsRun: true, //Auto run migrations when init connect db
  logging: ENABLE_ORM_LOGS,
  synchronize: true, // can be false in production
  keepConnectionAlive: !isTest,
  dropSchema: isTest,
};

export const postgresDefault = (): TypeOrmModuleOptions & {
  seeds: string[];
  factories: string[];
} => {
  const entities = [UserEntity, TokenEntity];
  const migrations = [
    `src/database/${DBNameConnections.DEFAULT}/migrations/*{.ts,.js}`,
  ];
  const seeds = [`src/database/${DBNameConnections.DEFAULT}/seeds/*{.ts,.js}`];
  const factories = [
    `src/database/${DBNameConnections.DEFAULT}/factories/*{.ts,.js}`,
  ];
  // Can auto run seeder when init connect connect db
  // https://typeorm-extension.tada5hi.net/guide/seeding.html#execute
  return {
    ...postgresOptions,
    name: DBNameConnections.DEFAULT,
    migrations,
    entities,
    database: DB_DATABASE,
    subscribers: [UserSubscriber],
    seeds,
    factories,
  };
};

export const initDBModules = [
  TypeOrmModule.forRootAsync({
    useFactory: postgresDefault,
    dataSourceFactory: options => {
      if (!options) {
        throw new Error('Invalid options passed');
      }

      return Promise.resolve(
        addTransactionalDataSource(new DataSource(options))
      );
    },
  }),
];
