import { ChargeProvider, WebhookEntity, WebhookTypes } from '@domain/entities';

export class WebhookModel {
  id!: string;
  provider!: ChargeProvider;
  provider_id!: string;
  payload!: string;
  type!: WebhookTypes;
  created_at!: Date;
  updated_at!: Date;

  static fromEntity(entity: WebhookEntity): WebhookModel {
    return {
      id: entity.id.value,
      payload: entity.props.payload,
      provider: entity.props.provider,
      provider_id: entity.props.providerId,
      type: entity.props.type,
      created_at: entity.createdAt.value,
      updated_at: entity.updatedAt.value,
    };
  }
}
