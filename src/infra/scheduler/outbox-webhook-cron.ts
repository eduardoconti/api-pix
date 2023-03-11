import { LoggerService } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import { ICronService, IQueue } from '@domain/core';
import { IOutboxRepository } from '@domain/core/repository';
import { AggregateTypeEnum } from '@domain/entities';

import { WebhookModel } from '@infra/prisma/models';

export class OutboxWebhookService implements ICronService {
  constructor(
    private readonly logger: LoggerService,
    private readonly outboxRepository: IOutboxRepository,
    private readonly queue: IQueue,
  ) {}

  @Cron('*/2 * * * * *')
  async handleCron() {
    this.logger.log('Called every 2 seconds', 'OutboxWebhookService');

    const data = await this.outboxRepository.findMany({
      published: false,
      aggregateType: AggregateTypeEnum.WEBHOOK,
    });
    if (data.length === 0) return;

    await Promise.all(
      data.map((e) => {
        const payload = JSON.parse(e.props.payload) as WebhookModel;
        this.queue.add(payload);
        e.markAsPublished();
        this.outboxRepository.update(e);
      }),
    );
  }
}
