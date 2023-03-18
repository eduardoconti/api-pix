import { DomainEvent, DomainEventProps } from '@domain/core';
import { ChargeProvider } from '@domain/entities';

export class ChargePayedDomainEvent extends DomainEvent {
  constructor(props: DomainEventProps<ChargePayedDomainEvent>) {
    super(props);
    this.amount = props.amount;
    this.provider = props.provider;
    this.userId = props.userId;
    this.e2eId = props.e2eId;
    this.providerId = props.providerId;
  }

  readonly amount: number;
  readonly provider: ChargeProvider;
  readonly userId: string;
  readonly e2eId: string;
  readonly providerId: string;
}
