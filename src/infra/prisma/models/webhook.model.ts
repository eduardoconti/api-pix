import { ChargeProvider, WebhookEntity, WebhookTypes } from '@domain/entities';
import { Amount, DateVO, UUID } from '@domain/value-objects';

export class WebhookModel {
  id!: string;
  provider!: ChargeProvider;
  provider_id!: string;
  payload!: string;
  type!: WebhookTypes;
  amount!: number;
  e2e_id!: string;
  created_at!: Date;
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
