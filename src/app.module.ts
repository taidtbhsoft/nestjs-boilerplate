import '@common/boilerplate.polyfill';

import path from 'node:path';

import {CacheInterceptor, CacheModule, CacheStore} from '@nestjs/cache-manager';
import {MiddlewareConsumer, Module, NestModule} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import {APP_INTERCEPTOR} from '@nestjs/core';
import {ScheduleModule} from '@nestjs/schedule';
import {ThrottlerModule} from '@nestjs/throttler';
import * as redisStore from 'cache-manager-redis-store';
import {ClsModule} from 'nestjs-cls';
import {
  AcceptLanguageResolver,
  HeaderResolver,
  I18nModule,
  QueryResolver,
} from 'nestjs-i18n';
import {LoggerMiddleware} from '@common/shared/middleware/logger.middleware';
import {SharedModule} from '@common/shared/shared.module';
import {AppConfigService} from '@config/app.config';
import {initDBModules} from '@config/database.config';
import {AuthModule} from '@modules/auth/auth.module';
import {UserModule} from '@modules/user/user.module';

@Module({
  imports: [
    ...initDBModules,
    AuthModule,
    UserModule,
    ClsModule.forRoot({
      global: true,
      middleware: {
        mount: true,
      },
    }),
    ThrottlerModule.forRootAsync({
      imports: [SharedModule],
      useFactory: (configService: AppConfigService) => ({
        throttlers: [configService.throttlerConfigs],
      }),
      inject: [AppConfigService],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    I18nModule.forRootAsync({
      useFactory: (configService: AppConfigService) => ({
        fallbackLanguage: configService.fallbackLanguage,
        loaderOptions: {
          path: path.join(__dirname, '/common/i18n/'),
          watch: configService.isDevelopment,
        },
      }),
      resolvers: [
        {use: QueryResolver, options: ['lang']},
        AcceptLanguageResolver,
        new HeaderResolver(['x-lang']),
      ],
      imports: [SharedModule],
      inject: [AppConfigService],
    }),
    ScheduleModule.forRoot(),
    process.env.REDIS_HOST
      ? CacheModule.register({
          isGlobal: true,
          ttl: 5, // seconds
          max: 10, // maximum number of items in cache
          store: redisStore as unknown as CacheStore,
          // Store-specific configuration:
          url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
        })
      : CacheModule.register({
          isGlobal: true,
          ttl: 5, // seconds
          max: 10, // maximum number of items in cache
        }),
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
