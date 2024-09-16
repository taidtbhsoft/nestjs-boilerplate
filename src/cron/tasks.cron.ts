import {AuthService} from '@/modules/auth/auth.service';
import {Inject, Injectable, Logger} from '@nestjs/common';
import {Cron, CronExpression} from '@nestjs/schedule';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);
  constructor(@Inject(AuthService) private authService: AuthService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  handleCron() {
    this.logger.debug('CleanUp token expired');
    this.authService.cleanUpTokens();
  }
}
