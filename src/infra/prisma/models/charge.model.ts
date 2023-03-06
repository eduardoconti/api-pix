import { ChargeEntity, ChargeProvider, ChargeStatus } from '@domain/entities';

export class ChargeModel {
  id!: string;
  amount!: number;
  emv!: string;
  provider!: ChargeProvider;
  status!: ChargeStatus;
  provider_id!: string;
  qr_code!: string;

  static fromEntity(entity: ChargeEntity): ChargeModel {
    return {
      id: entity.id.value,
      amount: entity.props.amount.value,
      emv: entity.props.emv,
      provider: entity.props.provider,
      status: entity.props.status,
      provider_id: entity.props.providerId,
      qr_code: entity.props.qrCode.value,
    };
  }
}
