import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { JsonValue } from '@domain/core';
import { UserWebhookNotificationEntity, WebhookTypes } from '@domain/entities';
import { DateVO, UUID } from '@domain/value-objects';

@Schema()
export class UserWebhookNotificationModel {
  @Prop({ index: true })
  id!: string;
  @Prop()
  user_id!: string;
  @Prop()
  type!: WebhookTypes;
  @Prop()
  charge_id!: string;
  @Prop({ type: Object })
  payload!: JsonValue;
  @Prop()
  attempts!: number;
  @Prop({ required: false, type: 'date' })
  delivered_at!: Date | null;
  @Prop()
  created_at!: Date;
  @Prop()
  updated_at!: Date;

  static fromEntity(
    entity: UserWebhookNotificationEntity,
  ): UserWebhookNotificationModel {
    return {
      id: entity.id.value,
      user_id: entity.props.userId.value,
      payload: entity.props.payload,
      attempts: entity.props.attempts,
      charge_id: entity.props.chargeId.value,
      type: entity.props.type,
      created_at: entity.createdAt.value,
      updated_at: entity.updatedAt.value,
      delivered_at: entity.props.deliverdAt?.value ?? null,
    };
  }

  static toEntity(
    model: UserWebhookNotificationModel,
  ): UserWebhookNotificationEntity {
    const {
      id,
      created_at,
      updated_at,
      payload,
      user_id,
      charge_id,
      type,
      attempts,
      delivered_at,
    } = model;
    return new UserWebhookNotificationEntity({
      id: new UUID(id),
      createdAt: new DateVO(created_at),
      updatedAt: new DateVO(updated_at),
      props: {
        type,
        payload: payload as string,
        userId: new UUID(user_id),
        chargeId: new UUID(charge_id),
        attempts,
        deliverdAt: delivered_at ? new DateVO(delivered_at) : undefined,
      },
    });
  }
}

export const UserWebhookNotificationSchema = SchemaFactory.createForClass(
  UserWebhookNotificationModel,
);
