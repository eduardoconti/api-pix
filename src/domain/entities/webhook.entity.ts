import { AggregateRoot } from '@domain/core';
import { UUID } from '@domain/value-objects';

export type WebhookTypes = 'CHARGE_PAYED';
export type WebhookProps = {
  providerId: string;
  provider: string;
  type: WebhookTypes;
  payload: string;
};

export type WebhookPrimitiveProps = {
  id: string;
  providerId: string;
  provider: string;
  type: WebhookTypes;
  payload: string;
};

export class WebhookEntity extends AggregateRoot<WebhookProps> {
  protected readonly _id!: UUID;

  static create(props: Omit<WebhookPrimitiveProps, 'id'>): WebhookEntity {
    const id = UUID.generate();
    const { providerId, provider, type, payload } = props;
    const entity = new WebhookEntity({
      id,
      props: {
        providerId,
        provider,
        type,
        payload,
      },
    });

    return entity;
  }
}
