import { Inject } from '@nestjs/common';
import { nanoid } from 'nanoid';

import { IUseCase } from '@domain/core';
import { IWebhookRepository } from '@domain/core/repository';
import { OutboxEntity, WebhookEntity, WebhookTypes } from '@domain/entities';

import { WebhookRepository } from '@infra/prisma';

export type ReceiveWebhookUseCaseOutput = string;
export type ReceiveWebhookUseCaseInput = {
  provider: string;
  providerId: string;
  providerJson: string;
  endToEndId: string;
  type: WebhookTypes;
};

export type IReceiveWebhookUseCase = IUseCase<
  ReceiveWebhookUseCaseInput,
  ReceiveWebhookUseCaseOutput
>;
export class ReceiveWebhookUseCase implements IReceiveWebhookUseCase {
  constructor(
    @Inject(WebhookRepository)
    private readonly webhookRepository: IWebhookRepository,
  ) {}
  async execute(data: ReceiveWebhookUseCaseInput) {
    const { provider, providerId, providerJson, type } = data;
    const webhookEntity = WebhookEntity.create({
      provider,
      providerId,
      payload: providerJson,
      type,
    });

    const outBox = OutboxEntity.create({
      aggregateId: webhookEntity.id.value,
      payload: JSON.stringify(data),
      aggregateType: type,
      eventId: nanoid(),
    });
    await this.webhookRepository.saveWithOutbox(webhookEntity, outBox);
    return 'success';
  }
}
