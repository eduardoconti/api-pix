import { ChargeEntity, ChargeProvider, ChargeStatus } from '@domain/entities';
import { Amount, DateVO, QrCode64, UUID } from '@domain/value-objects';
export class ChargeModel {
  id!: string;
  amount!: number;
  status!: ChargeStatus;
  provider!: ChargeProvider;
  emv!: string | null;
  provider_id!: string | null;
  qr_code!: string | null;
  e2e_id!: string | null;
  created_at!: Date;
  updated_at!: Date;

  static fromEntity(entity: ChargeEntity): ChargeModel {
    return {
      id: entity.id.value,
      amount: entity.props.amount.value,
      provider: entity.props.provider,
      status: entity.props.status,
      emv: entity.props?.emv ?? null,
      provider_id: entity.props?.providerId ?? null,
      qr_code: entity.props?.qrCode?.value ?? null,
      created_at: entity.createdAt.value,
      updated_at: entity.updatedAt.value,
      e2e_id: entity.props?.e2eId ?? null,
    };
  }

  static toEntity({
    amount,
    created_at,
    emv,
    id,
    provider,
    provider_id,
    qr_code,
    status,
    updated_at,
    e2e_id,
  }: ChargeModel): ChargeEntity {
    return new ChargeEntity({
      id: new UUID(id),
      createdAt: new DateVO(created_at),
      updatedAt: new DateVO(updated_at),
      props: {
        amount: new Amount(amount),
        emv: emv ?? undefined,
        status,
        qrCode: qr_code ? new QrCode64(qr_code) : undefined,
        provider,
        providerId: provider_id ?? undefined,
        e2eId: e2e_id ?? undefined,
      },
    });
  }
}
