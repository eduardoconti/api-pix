import { LoggerService } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { ICronService } from '@domain/core';
import { IOutboxRepository } from '@domain/core/repository';

export class CleanOutboxService implements ICronService {
  constructor(
    private readonly logger: LoggerService,
    private readonly outboxRepository: IOutboxRepository,
  ) {}

  @Cron(CronExpression.EVERY_4_HOURS)
  async handleCron() {
    this.logger.log('Called every 4 hours', 'CleanOutboxService');

    await this.outboxRepository.sql(
      `DELETE FROM outbox WHERE published = true AND created_at < NOW() - INTERVAL '12 hours'`,
    );
  }
}
