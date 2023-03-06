import { ChargeProvider, WebhookEntity, WebhookTypes } from '@domain/entities';
import { DateVO, UUID } from '@domain/value-objects';

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

  static toEntity(model: WebhookModel): WebhookEntity {
    const { id, created_at, updated_at, payload, provider, provider_id, type } =
      model;
    return new WebhookEntity({
      id: new UUID(id),
      createdAt: new DateVO(created_at),
      updatedAt: new DateVO(updated_at),
      props: {
        type,
        payload,
        provider,
        providerId: provider_id,
      },
    });
  }
}
