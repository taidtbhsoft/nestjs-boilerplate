import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PostgreSqlContainer } from '@testcontainers/postgresql';
import { initializeTransactionalContext } from 'typeorm-transactional';

import { AppModule } from '../src/app.module';

let app: INestApplication;

export async function initTest(): Promise<INestApplication> {
  initializeTransactionalContext();
  // Init PostgreSqlContainer
  const defaultDB = 'postgres_test';
  const container = await new PostgreSqlContainer()
    .withDatabase(defaultDB)
    .withUsername(defaultDB)
    .withPassword(defaultDB)
    .start();
  // Set config env
  process.env.DB_HOST = container.getHost();
  process.env.DB_PORT = container.getPort().toString();
  process.env.DB_DATABASE = container.getDatabase();
  process.env.DB_USERNAME = defaultDB;
  process.env.DB_PASSWORD = defaultDB;

  const moduleFixture = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  app = moduleFixture.createNestApplication();

  return app.init();
}
