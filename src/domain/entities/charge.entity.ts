import { AggregateRoot } from '@domain/core';
import { ChargeCreatedDomainEvent } from '@domain/events';
import { Amount, QrCode64, UUID } from '@domain/value-objects';

export type ChargeProvider = 'CELCOIN';
export type ChargeStatus = 'ACTIVE' | 'PAYED' | 'EXPIRED';

export type ChargeProps = {
  amount: Amount;
  emv: string;
  provider: ChargeProvider;
  status: ChargeStatus;
  providerId: string;
  qrCode: QrCode64;
};

export type ChargePrimitiveProps = {
  id: string;
  amount: number;
  emv: string;
  provider: ChargeProvider;
  status: ChargeStatus;
  providerId: string;
  qrCode: string;
};

export class ChargeEntity extends AggregateRoot<ChargeProps> {
  protected readonly _id!: UUID;

  static create(props: Omit<ChargePrimitiveProps, 'id'>): ChargeEntity {
    const id = UUID.generate();
    const { amount, emv, provider, status, providerId, qrCode } = props;
    const entity = new ChargeEntity({
      id,
      props: {
        amount: new Amount(amount),
        emv,
        status,
        provider,
        providerId,
        qrCode: new QrCode64(qrCode),
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
        qrCode,
      }),
    );
    return entity;
  }
}
