import { LoggerService } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { ICronService } from '@domain/core';
import { IOutboxRepository } from '@domain/core/repository';

export class CleanOutboxService implements ICronService {
  constructor(
    private readonly logger: LoggerService,
    private readonly outboxRepository: IOutboxRepository,
  ) {}

  @Cron(CronExpression.EVERY_5_MINUTES)
  async handleCron() {
    this.logger.log('Called every 5 minutes', 'CleanOutboxService');

    await this.outboxRepository
      .sql(
        `DELETE FROM outbox WHERE published = true AND created_at < NOW() - INTERVAL '5 minutes'`,
      )
      .catch((e) => {
        this.logger.error(`failed to execute cron CleanOutboxService`, e);
      });
  }
}
