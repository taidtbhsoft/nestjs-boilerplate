import type {Provider} from '@nestjs/common';
import {Global, Module} from '@nestjs/common';
import {CqrsModule} from '@nestjs/cqrs';

import {AppConfigService} from '@config/app.config';
import {TranslationService} from '@common/shared/services/translation.service';

const providers: Provider[] = [AppConfigService, TranslationService];

@Global()
@Module({
  providers,
  imports: [CqrsModule],
  exports: [...providers, CqrsModule],
})
export class SharedModule {}
