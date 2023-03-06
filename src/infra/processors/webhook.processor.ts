import { OnQueueActive, OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { Inject, Logger } from '@nestjs/common';
import { Job } from 'bull';

import { IChargeRepository } from '@domain/core/repository';
import { ArgumentInvalidException } from '@domain/exceptions';

import { ChargeNotFoundException } from '@infra/exceptions';
import { ChargeRepository } from '@infra/prisma';
import { WebhookModel } from '@infra/prisma/models';

@Processor('webhook')
export class WebhookConsumer {
  constructor(
    private readonly logger: Logger,
    @Inject(ChargeRepository)
    private readonly chargeRepository: IChargeRepository,
  ) {}
  @Process()
  async processWebhook(job: Job<WebhookModel>) {
    const { data: webhookModel } = job;
    const charge = await this.chargeRepository.findOne({
      providerId: webhookModel.provider_id,
    });

    const webhookEntity = WebhookModel.toEntity(webhookModel);
    if (webhookEntity.isPayedCharge()) {
      charge.pay();
    }

    await this.chargeRepository.update(charge);
  }

  @OnQueueActive()
  onActive(job: Job<WebhookModel>) {
    this.logger.log(
      `Processing job ${job.id} of type ${job.queue.name}`,
      'WebhookConsumer',
    );
  }

  @OnQueueFailed()
  async onQueueFailed(job: Job<WebhookModel>, err: Error) {
    this.logger.error(
      `job ${job.id} of type ${job.queue.name} with error "${job.failedReason}"`,
      'WebhookConsumer',
    );

    if (
      err instanceof ArgumentInvalidException ||
      err instanceof ChargeNotFoundException
    ) {
      await job.remove();
    }
  }
}
