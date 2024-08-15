import {
  ClassSerializerInterceptor,
  HttpStatus,
  Logger,
  UnprocessableEntityException,
  ValidationPipe,
} from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { ExpressAdapter } from '@nestjs/platform-express';
import compression from 'compression';
import helmet from 'helmet';
import morgan from 'morgan';
import { initializeTransactionalContext } from 'typeorm-transactional';

import { AppModule } from './app.module';
import { HttpExceptionFilter } from './filters/bad-request.filter';
import { QueryFailedFilter } from './filters/query-failed.filter';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { TimeoutInterceptor } from './interceptors/timeout.interceptor';
import { TranslationInterceptor } from './interceptors/translation-interceptor.service';
import { LoggerService } from './logger/logger.service';
import { setupSwagger } from './setup-swagger';
import { ApiConfigService } from './shared/services/api-config.service';
import { TranslationService } from './shared/services/translation.service';
import { SharedModule } from './shared/shared.module';

export async function bootstrap(): Promise<NestExpressApplication> {
  try {
    initializeTransactionalContext();
    const app = await NestFactory.create<NestExpressApplication>(
      AppModule,
      new ExpressAdapter(),
      { cors: true },
    );
    app.enable('trust proxy'); // only if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
    app.use(helmet());
    // app.setGlobalPrefix('/api'); use api as global prefix if you don't have subdomain
    app.use(compression());
    app.use(morgan('combined'));
    app.enableVersioning();
    app.setGlobalPrefix('/api/v1');

    const reflector = app.get(Reflector);

    app.useGlobalFilters(
      new HttpExceptionFilter(reflector),
      new QueryFailedFilter(reflector),
    );

    app.useGlobalInterceptors(
      new ClassSerializerInterceptor(reflector),
      new TranslationInterceptor(
        app.select(SharedModule).get(TranslationService),
      ),
      new LoggingInterceptor(),
      new TimeoutInterceptor(),
    );

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        transform: true,
        dismissDefaultMessages: true,
        exceptionFactory: (errors) => new UnprocessableEntityException(errors),
      }),
    );

    const configService = app.select(SharedModule).get(ApiConfigService);

    if (configService.documentationEnabled) {
      setupSwagger(app);
    }

    // Starts listening for shutdown hooks
    if (!configService.isDevelopment) {
      app.enableShutdownHooks();
    }

    app.useLogger(new LoggerService());

    const port = configService.appConfig.port;
    await app.listen(port);

    console.info(`server running on ${await app.getUrl()}`);

    return app;
  } catch (error) {
    console.error(error);
    Logger.error(`❌  Error starting server, ${error}`, '', 'Bootstrap', false);

    throw new Error(`❌  Error starting server, ${error}`);
  }
}

void bootstrap();
