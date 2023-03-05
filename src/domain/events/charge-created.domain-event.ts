import { DomainEvent, DomainEventProps } from '@domain/core';
import { ChargeProvider, ChargeStatus } from '@domain/entities';

export class ChargeCreatedDomainEvent extends DomainEvent {
  constructor(props: DomainEventProps<ChargeCreatedDomainEvent>) {
    super(props);
    this.amount = props.amount;
    this.emv = props.emv;
    this.provider = props.provider;
    this.status = props.status;
    this.providerId = props.providerId;
  }

  readonly amount: number;
  readonly emv: string;
  readonly provider: ChargeProvider;
  readonly status: ChargeStatus;
  readonly providerId: string;
}
