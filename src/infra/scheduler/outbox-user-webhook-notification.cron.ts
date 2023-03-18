import { LoggerService } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import { WebhookNotificationPayload } from '@app/contracts';

import { ICronService, IQueue } from '@domain/core';
import { IOutboxRepository } from '@domain/core/repository';
import { AggregateTypeEnum } from '@domain/entities';

export class OutboxUserWebhookNotificationService implements ICronService {
  constructor(
    private readonly logger: LoggerService,
    private readonly outboxRepository: IOutboxRepository,
    private readonly queue: IQueue<WebhookNotificationPayload>,
  ) {}

  @Cron('*/2 * * * * *')
  async handleCron() {
    this.logger.log(
      'Called every 2 seconds',
      'OutboxUserWebhookNotificationService',
    );

    const data = await this.outboxRepository.findMany({
      published: false,
      aggregateType: AggregateTypeEnum.USER_WEBHOOK_NOTIFICATION,
    });
    if (data.length === 0) return;

    data.forEach(async (e) => {
      try {
        const payload = JSON.parse(
          e.props.payload,
        ) as WebhookNotificationPayload;
        await this.queue.add(payload);
        e.markAsPublished();
        await this.outboxRepository.update(e);
      } catch (error) {
        this.logger.error(
          `failed to execute cron OutboxUserWebhookNotificationService for Outbox ${e.id.value}`,
          error,
        );
      }
    });
  }
}
