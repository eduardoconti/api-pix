import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { IOutboxRepository } from '@domain/core/repository';

import { OutboxRepository } from '@infra/prisma';

@Injectable()
export class CleanOutboxService {
  constructor(
    private readonly logger: Logger,
    @Inject(OutboxRepository)
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
