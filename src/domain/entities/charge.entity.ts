import { AggregateRoot } from '@domain/core';
import { ChargeCreatedDomainEvent } from '@domain/events';
import { Amount, UUID } from '@domain/value-objects';

export type ChargeProvider = 'CELCOIN';
export type ChargeStatus = 'ACTIVE' | 'PAYED' | 'EXPIRED';

export type ChargeProps = {
  amount: Amount;
  emv: string;
  provider: ChargeProvider;
  status: ChargeStatus;
  providerId: string;
};

export type ChargePrimiteProps = {
  id: string;
  amount: number;
  emv: string;
  provider: ChargeProvider;
  status: ChargeStatus;
  providerId: string;
};

export class ChargeEntity extends AggregateRoot<ChargeProps> {
  protected readonly _id!: UUID;

  static create(props: Omit<ChargePrimiteProps, 'id'>): ChargeEntity {
    const id = UUID.generate();
    const { amount, emv, provider, status, providerId } = props;
    const entity = new ChargeEntity({
      id,
      props: {
        amount: new Amount(amount),
        emv,
        status,
        provider,
        providerId,
      },
    });

    entity.addEvent(
      new ChargeCreatedDomainEvent({
        aggregateId: entity.id.value,
        amount,
        emv,
        provider,
        status,
        providerId,
      }),
    );
    return entity;
  }
}
