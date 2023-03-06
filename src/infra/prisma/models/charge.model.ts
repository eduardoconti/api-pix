import { ChargeEntity, ChargeProvider, ChargeStatus } from '@domain/entities';
import { Amount, DateVO, QrCode64, UUID } from '@domain/value-objects';

export class ChargeModel {
  id!: string;
  amount!: number;
  emv!: string;
  provider!: ChargeProvider;
  status!: ChargeStatus;
  provider_id!: string;
  qr_code!: string;
  created_at!: Date;
  updated_at!: Date;

  static fromEntity(entity: ChargeEntity): ChargeModel {
    return {
      id: entity.id.value,
      amount: entity.props.amount.value,
      emv: entity.props.emv,
      provider: entity.props.provider,
      status: entity.props.status,
      provider_id: entity.props.providerId,
      qr_code: entity.props.qrCode.value,
      created_at: entity.createdAt.value,
      updated_at: entity.updatedAt.value,
    };
  }

  static toEntity(model: ChargeModel): ChargeEntity {
    const {
      amount,
      created_at,
      emv,
      id,
      provider,
      provider_id,
      qr_code,
      status,
      updated_at,
    } = model;
    return new ChargeEntity({
      id: new UUID(id),
      createdAt: new DateVO(created_at),
      updatedAt: new DateVO(updated_at),
      props: {
        amount: new Amount(amount),
        emv,
        status,
        qrCode: new QrCode64(qr_code),
        provider,
        providerId: provider_id,
      },
    });
  }
}
