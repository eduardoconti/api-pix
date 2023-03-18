import { AggregateRoot } from '@domain/core';
import { DateVO, UUID } from '@domain/value-objects';

import { WebhookTypes } from './webhook.entity';

export type UserWebhookNotificationProps = {
  userId: UUID;
  type: WebhookTypes;
  payload: string;
  attempts: number;
  chargeId: UUID;
  deliverdAt?: DateVO;
};

export type UserWebhookNotificationPrimitiveProps = {
  id: string;
  userId: string;
  type: WebhookTypes;
  payload: string;
  attempts: number;
  deliverdAt?: Date;
  chargeId: string;
};

export class UserWebhookNotificationEntity extends AggregateRoot<UserWebhookNotificationProps> {
  protected readonly _id!: UUID;

  static create(
    props: Omit<
      UserWebhookNotificationPrimitiveProps,
      'id' | 'deliverdAt' | 'attempts'
    >,
  ): UserWebhookNotificationEntity {
    const id = UUID.generate();
    const { userId, type, payload, chargeId } = props;
    const entity = new UserWebhookNotificationEntity({
      id,
      props: {
        userId: new UUID(userId),
        type,
        payload,
        attempts: 0,
        chargeId: new UUID(chargeId),
      },
    });

    return entity;
  }

  isDeliverd(): boolean {
    return this.props.deliverdAt ? true : false;
  }

  markAsDeliverd() {
    this.props.deliverdAt = DateVO.now();
  }

  addAttempts() {
    this.props.attempts++;
  }
}
