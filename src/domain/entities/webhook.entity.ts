import { AggregateRoot } from '@domain/core';
import { Amount, UUID } from '@domain/value-objects';

import { ChargeProvider } from './charge.entity';

export type WebhookTypes = 'CHARGE_PAYED' | 'CHARGE_REFUNDED';
export type WebhookProps = {
  providerId: string;
  provider: ChargeProvider;
  type: WebhookTypes;
  payload: string;
  amount: Amount;
  e2eId: string;
};

export type WebhookPrimitiveProps = {
  id: string;
  providerId: string;
  provider: ChargeProvider;
  type: WebhookTypes;
  payload: string;
  amount: number;
  e2eId: string;
};

export class WebhookEntity extends AggregateRoot<WebhookProps> {
  protected readonly _id!: UUID;

  static create(props: Omit<WebhookPrimitiveProps, 'id'>): WebhookEntity {
    const id = UUID.generate();
    const { providerId, provider, type, payload, amount, e2eId } = props;
    const entity = new WebhookEntity({
      id,
      props: {
        providerId,
        provider,
        type,
        payload,
        amount: new Amount(amount),
        e2eId,
      },
    });

    return entity;
  }

  isPayedCharge(): boolean {
    return this.props.type === 'CHARGE_PAYED';
  }
}
