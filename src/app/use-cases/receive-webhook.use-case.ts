import { IUseCase } from '@domain/core';
import { IWebhookRepository } from '@domain/core/repository';
import {
  AggregateTypeEnum,
  ChargeProvider,
  OutboxEntity,
  WebhookEntity,
  WebhookTypes,
} from '@domain/entities';

import { WebhookModel } from '@infra/database/models';

export type ReceiveWebhookOutput = string;
export type ReceiveWebhookInput = {
  provider: ChargeProvider;
  providerId: string;
  providerJson: string;
  endToEndId: string;
  type: WebhookTypes;
  amount: number;
};

export type IReceiveWebhookUseCase = IUseCase<
  ReceiveWebhookInput,
  ReceiveWebhookOutput
>;
export class ReceiveWebhook implements IReceiveWebhookUseCase {
  constructor(private readonly webhookRepository: IWebhookRepository) {}
  async execute({
    provider,
    providerId,
    providerJson,
    type,
    amount,
    endToEndId,
  }: ReceiveWebhookInput) {
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
      aggregateType: AggregateTypeEnum.WEBHOOK,
    });
    await this.webhookRepository.saveWithOutbox(webhookEntity, outBox);
    return 'success';
  }
}
