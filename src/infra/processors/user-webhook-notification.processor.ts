import { OnQueueActive, OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';

import { WebhookNotificationPayload } from '@app/contracts';

import { ILogger, IUserWebhookNotificationRepository } from '@domain/core';
import { ArgumentInvalidException } from '@domain/exceptions';
import { UUID } from '@domain/value-objects';

import { IHttpService } from '@infra/http-service';

@Processor('user_webhook_notification')
export class UserWebhookNotificationConsumer {
  constructor(
    private readonly logger: ILogger,
    private readonly httpService: IHttpService,
    private readonly userWebhookNotificationRepository: IUserWebhookNotificationRepository,
  ) {}
  @Process()
  async process(job: Job<WebhookNotificationPayload>) {
    const {
      data: {
        charge_id,
        e2e_id,
        provider,
        provider_id,
        url,
        type,
        notification_id,
      },
    } = job;
    const entity = await this.userWebhookNotificationRepository.findOne({
      id: new UUID(notification_id),
    });

    await this.httpService.post({
      url: url,
      body: {
        charge_id,
        type,
        notification_id,
        provider,
        provider_id,
        e2e_id,
      },
    });
    entity.markAsDeliverd();
    await this.userWebhookNotificationRepository.update(entity);
  }

  @OnQueueActive()
  onActive(job: Job<WebhookNotificationPayload>) {
    this.logger.log(
      `Processing job ${job.id} of type ${job.queue.name}`,
      'UserWebhookNotificationConsumer',
    );
  }

  @OnQueueFailed()
  async onQueueFailed(job: Job<WebhookNotificationPayload>, err: Error) {
    this.logger.error(
      `job ${job.id} of type ${job.queue.name} with error "${job.failedReason}"`,
      'UserWebhookNotificationConsumer',
    );
    const entity = await this.userWebhookNotificationRepository.findOne({
      id: new UUID(job.data.notification_id),
    });
    entity.addAttempts();
    await this.userWebhookNotificationRepository.update(entity);

    if (err instanceof ArgumentInvalidException) {
      await job.remove();
    }
  }
}
