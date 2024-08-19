// eslint-disable-next-line n/no-extraneous-import
import * as dotenv from 'dotenv';

dotenv.config();
// environment
const NODE_ENV: string = process.env.NODE_ENV ?? 'development';
const DOMAIN: string = process.env.DOMAIN ?? 'localhost';
const PORT: number = Number(process.env.PORT) || 3000;
const DB_HOST: string = process.env.DB_HOST ?? 'localhost';
const DB_PASSWORD: string = process.env.DB_PASSWORD ?? '';
const DB_PORT: number = Number(process.env.DB_PORT) || 5432;
const DB_USERNAME: string = process.env.DB_USERNAME ?? 'postgres';
const ENABLE_ORM_LOGS: boolean = process.env.ENABLE_ORM_LOGS === 'true';
const DB_DATABASE: string = process.env.DB_DATABASE ?? 'postgres';
const KAFKA_GROUP_ID: string = process.env.KAFKA_GROUP_ID || '';
const KAFKA_TOPIC: string = process.env.KAFKA_TOPIC || '';
const KAFKA_BROKER: string = process.env.KAFKA_BROKER || '';

export {
  DB_DATABASE,
  DB_HOST,
  DB_PASSWORD,
  DB_PORT,
  DB_USERNAME,
  DOMAIN,
  ENABLE_ORM_LOGS,
  NODE_ENV,
  PORT,
  KAFKA_GROUP_ID,
  KAFKA_TOPIC,
  KAFKA_BROKER,
};
