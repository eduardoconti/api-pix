import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { ChargeProvider, WebhookEntity, WebhookTypes } from '@domain/entities';
import { Amount, DateVO, UUID } from '@domain/value-objects';

@Schema()
export class WebhookModel {
  @Prop({ index: true })
  id!: string;
  @Prop()
  provider!: ChargeProvider;
  @Prop()
  provider_id!: string;
  @Prop()
  payload!: string;
  @Prop()
  type!: WebhookTypes;
  @Prop()
  amount!: number;
  @Prop()
  e2e_id!: string;
  @Prop()
  created_at!: Date;
  @Prop()
  updated_at!: Date;

  static fromEntity(entity: WebhookEntity): WebhookModel {
    return {
      id: entity.id.value,
      payload: entity.props.payload,
      provider: entity.props.provider,
      provider_id: entity.props.providerId,
      amount: entity.props.amount.value,
      type: entity.props.type,
      created_at: entity.createdAt.value,
      updated_at: entity.updatedAt.value,
      e2e_id: entity.props.e2eId,
    };
  }

  static toEntity(model: WebhookModel): WebhookEntity {
    const {
      id,
      created_at,
      updated_at,
      payload,
      provider,
      provider_id,
      type,
      amount,
      e2e_id,
    } = model;
    return new WebhookEntity({
      id: new UUID(id),
      createdAt: new DateVO(created_at),
      updatedAt: new DateVO(updated_at),
      props: {
        type,
        payload,
        provider,
        providerId: provider_id,
        amount: new Amount(amount),
        e2eId: e2e_id,
      },
    });
  }
}

export const WebhookSchema = SchemaFactory.createForClass(WebhookModel);
