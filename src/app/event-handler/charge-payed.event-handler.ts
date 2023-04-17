import { OnEvent } from '@nestjs/event-emitter';

import { WebhookNotificationPayload } from '@app/contracts';

import {
  IUserRepository,
  IUserWebhookNotificationRepository,
} from '@domain/core';
import {
  AggregateTypeEnum,
  OutboxEntity,
  UserWebhookNotificationEntity,
  WebhookTypesEnum,
} from '@domain/entities';
import { ChargePayedDomainEvent } from '@domain/events';
import { UUID } from '@domain/value-objects';
export class ChargePayedListener {
  constructor(
    private readonly userWebhookRepository: IUserWebhookNotificationRepository,
    private readonly userRepository: IUserRepository,
  ) {}
  @OnEvent('ChargePayedDomainEvent', { async: true })
  async handle({
    aggregateId,
    amount,
    e2eId,
    provider,
    providerId,
    userId,
    id,
  }: ChargePayedDomainEvent) {
    const user = await this.userRepository.findOne({
      id: new UUID(userId),
    });

    const userWebhookNotificationEntity = UserWebhookNotificationEntity.create({
      chargeId: aggregateId,
      payload: {
        chargeId: aggregateId,
        amount,
        e2eId,
        provider,
        providerId,
      },
      type: WebhookTypesEnum.CHARGE_PAYED,
      userId: userId,
    });

    const payload: WebhookNotificationPayload = {
      charge_id: aggregateId,
      e2e_id: e2eId,
      provider: provider,
      provider_id: providerId,
      url: user.getUserWebhookHostByType(WebhookTypesEnum.CHARGE_PAYED).props
        .host.value,
      type: WebhookTypesEnum.CHARGE_PAYED,
      notification_id: userWebhookNotificationEntity.id.value,
      amount: amount,
    };

    const outBoxEntity = OutboxEntity.create({
      aggregateId: userWebhookNotificationEntity.id.value,
      aggregateType: AggregateTypeEnum.USER_WEBHOOK_NOTIFICATION,
      payload: JSON.stringify(payload),
      eventId: id,
    });

    await this.userWebhookRepository.saveWithOutbox(
      userWebhookNotificationEntity,
      outBoxEntity,
    );
  }
}
