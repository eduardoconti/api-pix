import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { ChargeEntity, ChargeProvider, ChargeStatus } from '@domain/entities';
import { Amount, DateVO, QrCode64, UUID } from '@domain/value-objects';
@Schema()
@ObjectType()
export class ChargeModel {
  @Field((_type) => ID)
  @Prop({ index: true })
  id!: string;
  @Field()
  @Prop()
  amount!: number;
  @Field()
  @Prop()
  status!: ChargeStatus;
  @Field()
  @Prop()
  provider!: ChargeProvider;
  @Field((_type) => String, { nullable: true })
  @Prop({ type: 'string', required: false })
  emv!: string | null;
  @Field((_type) => String, { nullable: true })
  @Prop({ type: 'string', required: false })
  provider_id!: string | null;
  @Field((_type) => String, { nullable: true })
  @Prop({ type: 'string', required: false })
  qr_code!: string | null;
  @Field((_type) => String, { nullable: true })
  @Prop({ type: 'string', required: false })
  e2e_id!: string | null;
  @Field()
  @Prop()
  created_at!: Date;
  @Field()
  @Prop()
  updated_at!: Date;
  @Field()
  @Prop()
  user_id!: string;

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
      user_id: entity.props.userId.value,
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
    user_id,
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
        userId: new UUID(user_id),
      },
    });
  }
}

export const ChargeSchema = SchemaFactory.createForClass(ChargeModel);
