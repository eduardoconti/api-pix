import { DomainEvent, DomainEventProps } from '@domain/core';
import { ChargeProvider, ChargeStatus } from '@domain/entities';

export class ChargeCreatedDomainEvent extends DomainEvent {
  constructor(props: DomainEventProps<ChargeCreatedDomainEvent>) {
    super(props);
    this.amount = props.amount;
    this.provider = props.provider;
    this.status = props.status;
  }

  readonly amount: number;
  readonly provider: ChargeProvider;
  readonly status: ChargeStatus;
}
