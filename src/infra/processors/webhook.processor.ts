import { OnQueueActive, OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { Inject, Logger } from '@nestjs/common';
import { Job } from 'bull';

import { IChargeRepository } from '@domain/core/repository';
import { WebhookEntity } from '@domain/entities';

import { ChargeRepository } from '@infra/prisma';

@Processor('webhook')
export class WebhookConsumer {
  constructor(
    private readonly logger: Logger,
    @Inject(ChargeRepository)
    private readonly chargeRepository: IChargeRepository,
  ) {}
  @Process()
  async processWebhook(job: Job<WebhookEntity>) {
    const { data: webhookEntity } = job;
    const charge = await this.chargeRepository.findOne({
      providerId: webhookEntity.props.providerId,
    });

    if (webhookEntity.isPayedCharge()) {
      charge.pay();
    }

    await this.chargeRepository.save(charge);
  }

  @OnQueueActive()
  onActive(job: Job<WebhookEntity>) {
    this.logger.log(
      `Processing job ${job.id} of type ${job.queue.name}`,
      'WebhookConsumer',
    );
  }

  @OnQueueFailed()
  onQueueFailed(job: Job<WebhookEntity>, err: Error) {
    this.logger.error(
      `job ${job.id} of type ${job.queue.name} with error ${JSON.stringify(
        err,
      )}...`,
      'WebhookConsumer',
    );
  }
}
