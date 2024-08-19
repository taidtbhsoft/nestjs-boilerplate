import {
  ClassSerializerInterceptor,
  ConsoleLogger,
  HttpStatus,
  Logger,
  UnprocessableEntityException,
  ValidationPipe,
} from '@nestjs/common';
import {NestFactory, Reflector} from '@nestjs/core';
import type {NestExpressApplication} from '@nestjs/platform-express';
import {ExpressAdapter} from '@nestjs/platform-express';
import compression from 'compression';
import helmet from 'helmet';
import {initializeTransactionalContext} from 'typeorm-transactional';

import {AppModule} from '@/app.module';
import {setupSwagger} from '@common/swagger/setup-swagger';
import {SharedModule} from '@common/shared/shared.module';
import {AppConfigService} from '@config/app.config';
import {MicroserviceOptions, Transport} from '@nestjs/microservices';
import {KAFKA_BROKER, KAFKA_GROUP_ID} from '@config/env.config';

export async function bootstrap(): Promise<NestExpressApplication> {
  try {
    initializeTransactionalContext();
    const app = await NestFactory.create<NestExpressApplication>(
      AppModule,
      new ExpressAdapter(),
      {cors: true}
    );
    KAFKA_BROKER &&
      app.connectMicroservice<MicroserviceOptions>({
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: [KAFKA_BROKER],
          },
          consumer: {
            groupId: KAFKA_GROUP_ID,
          },
        },
      });
    app.enable('trust proxy'); // only if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
    app.use(helmet());
    // app.setGlobalPrefix('/api'); use api as global prefix if you don't have subdomain
    app.use(compression());
    app.enableVersioning();
    app.setGlobalPrefix('/api/v1');

    const reflector = app.get(Reflector);

    app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        transform: true,
        dismissDefaultMessages: true,
        exceptionFactory: errors => new UnprocessableEntityException(errors),
      })
    );

    const configService = app.select(SharedModule).get(AppConfigService);

    if (configService.documentationEnabled) {
      setupSwagger(app);
    }

    // Starts listening for shutdown hooks
    if (!configService.isDevelopment) {
      app.enableShutdownHooks();
    }

    app.useLogger(new ConsoleLogger());
    await app.startAllMicroservices();
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
