import { Inject } from '@nestjs/common';

import { IUseCase } from '@domain/core';
import { IWebhookRepository } from '@domain/core/repository';
import {
  ChargeProvider,
  OutboxEntity,
  WebhookEntity,
  WebhookTypes,
} from '@domain/entities';

import { WebhookRepository } from '@infra/prisma';
import { WebhookModel } from '@infra/prisma/models';

export type ReceiveWebhookUseCaseOutput = string;
export type ReceiveWebhookUseCaseInput = {
  provider: ChargeProvider;
  providerId: string;
  providerJson: string;
  endToEndId: string;
  type: WebhookTypes;
  amount: number;
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
    const { provider, providerId, providerJson, type, amount, endToEndId } =
      data;
    const webhookEntity = WebhookEntity.create({
      provider,
      providerId,
      payload: providerJson,
      type,
      amount,
      e2eId: endToEndId,
    });

    const outBox = OutboxEntity.create({
      aggregateId: webhookEntity.id.value,
      payload: JSON.stringify(WebhookModel.fromEntity(webhookEntity)),
      aggregateType: 'WEBHOOK',
    });
    await this.webhookRepository.saveWithOutbox(webhookEntity, outBox);
    return 'success';
  }
}
