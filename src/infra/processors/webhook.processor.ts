import { OnQueueActive, OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';

import { IEventEmitter, ILogger } from '@domain/core';
import { IChargeRepository } from '@domain/core/repository';
import { ArgumentInvalidException } from '@domain/exceptions';

import { ChargeNotFoundException } from '@infra/exceptions';
import { WebhookModel } from '@infra/prisma/models';

@Processor('webhook')
export class WebhookConsumer {
  constructor(
    private readonly logger: ILogger,
    private readonly chargeRepository: IChargeRepository,
    private readonly eventEmitter: IEventEmitter,
  ) {}
  @Process()
  async process(job: Job<WebhookModel>) {
    const { data: webhookModel } = job;
    const charge = await this.chargeRepository.findOne({
      providerId: webhookModel.provider_id,
      provider: webhookModel.provider,
    });

    const webhookEntity = WebhookModel.toEntity(webhookModel);
    if (webhookEntity.isPayedCharge()) {
      charge.pay({
        amount: webhookEntity.props.amount.value,
        e2eId: webhookEntity.props.e2eId,
      });
      await this.chargeRepository.update(charge);
      await Promise.all(
        charge.domainEvents.map((e) => {
          return this.eventEmitter.emitAsync(e.constructor.name, e);
        }),
      );
      charge.clearEvents();
    }
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
