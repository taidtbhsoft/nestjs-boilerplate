import {DataSource, DataSourceOptions} from 'typeorm';

import {postgresDefault} from '@/config/database.config';

export const dataSource = new DataSource(
  postgresDefault() as DataSourceOptions
);
