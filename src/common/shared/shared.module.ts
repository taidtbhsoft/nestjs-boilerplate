import type { Provider } from '@nestjs/common';
import { Global, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { AppConfigService } from '../../config/app.config';
import { TranslationService } from '../shared/services/translation.service';
import { ValidatorService } from '../shared/services/validator.service';

const providers: Provider[] = [
  AppConfigService,
  ValidatorService,
  TranslationService,
];

@Global()
@Module({
  providers,
  imports: [CqrsModule],
  exports: [...providers, CqrsModule],
})
export class SharedModule {}
