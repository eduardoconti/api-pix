import { AggregateRoot } from '@domain/core';
import { ChargeCreatedDomainEvent } from '@domain/events';
import { ArgumentInvalidException } from '@domain/exceptions';
import { Amount, QrCode64, UUID } from '@domain/value-objects';

export enum ChargeProviderEnum {
  CELCOIN = 'CELCOIN',
}

export enum ChargeStatusEnum {
  ACTIVE = 'ACTIVE',
  PAYED = 'PAYED',
  EXPIRED = 'EXPIRED',
  FAILED = 'FAILED',
  PENDING = 'PENDING',
}
export type ChargeProvider = keyof typeof ChargeProviderEnum;
export type ChargeStatus = keyof typeof ChargeStatusEnum;

export type ChargeProps = {
  amount: Amount;
  provider: ChargeProvider;
  status: ChargeStatus;
  emv?: string;
  providerId?: string;
  qrCode?: QrCode64;
  e2eId?: string;
};

export type ChargePrimitiveProps = {
  id: string;
  amount: number;
  provider: ChargeProvider;
  status: ChargeStatus;
  emv?: string;
  providerId?: string;
  qrCode?: string;
  e2eId?: string;
};

export class ChargeEntity extends AggregateRoot<ChargeProps> {
  protected readonly _id!: UUID;

  static create(
    props: Pick<ChargePrimitiveProps, 'amount' | 'provider'>,
  ): ChargeEntity {
    const id = UUID.generate();
    const { amount, provider } = props;
    const entity = new ChargeEntity({
      id,
      props: {
        amount: new Amount(amount),
        status: ChargeStatusEnum.PENDING,
        provider,
      },
    });

    entity.addEvent(
      new ChargeCreatedDomainEvent({
        aggregateId: entity.id.value,
        amount,
        provider,
        status: entity.props.status,
      }),
    );
    return entity;
  }

  pay(props: Required<Pick<ChargePrimitiveProps, 'amount' | 'e2eId'>>): void {
    if (this.isPayed()) {
      throw new ArgumentInvalidException('this charge is payed');
    }

    if (this.isExpired()) {
      throw new ArgumentInvalidException('this charge is expired');
    }

    if (!new Amount(props.amount).equals(this.props.amount)) {
      throw new ArgumentInvalidException('the amount value does not match');
    }
    this.props.e2eId = props.e2eId;
    this.props.status = 'PAYED';
  }

  isPayed(): boolean {
    return this.props.status === 'PAYED';
  }

  isExpired(): boolean {
    return this.props.status === 'EXPIRED';
  }

  markAsFailed(): void {
    this.props.status = 'FAILED';
  }

  get qrCodeValue(): string {
    if (!this.props.qrCode) {
      throw new ArgumentInvalidException('qrcode not found');
    }
    return this.props.qrCode?.value;
  }

  async completeWithPSPResponse(
    props: Required<Pick<ChargePrimitiveProps, 'emv' | 'providerId'>>,
  ): Promise<void> {
    this.props.emv = props.emv;
    this.props.providerId = props.providerId;
    this.props.qrCode = await QrCode64.base64(props.emv);
    this.props.status = ChargeStatusEnum.ACTIVE;
  }
}
