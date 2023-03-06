import { WebhookEntity, WebhookTypes } from '@domain/entities';

export class WebhookModel {
  id!: string;
  provider!: string;
  provider_id!: string;
  payload!: string;
  type!: WebhookTypes;

  static fromEntity(entity: WebhookEntity): WebhookModel {
    return {
      id: entity.id.value,
      payload: entity.props.payload,
      provider: entity.props.provider,
      provider_id: entity.props.providerId,
      type: entity.props.type,
    };
  }
}
