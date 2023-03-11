import { InjectQueue } from '@nestjs/bull';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Queue } from 'bull';

import { IOutboxRepository } from '@domain/core/repository';
import { AggregateTypeEnum } from '@domain/entities';

import { OutboxRepository } from '@infra/prisma';
import { WebhookModel } from '@infra/prisma/models';

@Injectable()
export class OutboxWebhookService {
  constructor(
    private readonly logger: Logger,
    @Inject(OutboxRepository)
    private readonly outboxRepository: IOutboxRepository,
    @InjectQueue('webhook')
    private readonly queue: Queue,
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
