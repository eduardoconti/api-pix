import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { IChargeRepository, QueryParams } from '@domain/core';
import { ChargeEntity, ChargeProps } from '@domain/entities';

import { ChargeModel } from '@infra/database/models';
import { ChargeNotFoundException } from '@infra/exceptions';

@Injectable()
export class ChargeRepositoryMongo implements IChargeRepository {
  constructor(
    @InjectModel(ChargeModel.name)
    private readonly chargeModel: Model<ChargeModel>,
  ) {}

  async save(entity: ChargeEntity): Promise<ChargeEntity> {
    const createdCharge = new this.chargeModel(ChargeModel.fromEntity(entity));
    const saved = await createdCharge.save();
    return ChargeModel.toEntity(saved);
  }

  async findOne(params: QueryParams<ChargeProps>): Promise<ChargeEntity> {
    const charge = await this.chargeModel.findOne({
      provider: params.provider,
      provider_id: params.providerId,
    });

    if (!charge) {
      throw new ChargeNotFoundException('charge not found');
    }
    return ChargeModel.toEntity(charge);
  }

  async findMany(
    params: QueryParams<ChargeProps>,
  ): Promise<ChargeEntity[] | []> {
    const query: Partial<ChargeModel> = {};
    if (params?.status) {
      query.status = params.status;
    }
    if (params?.userId) {
      query.user_id = params.userId.value;
    }
    const charges = await this.chargeModel.find(query);
    return charges.map((e) => {
      return ChargeModel.toEntity(e);
    });
  }

  async update(entity: ChargeEntity): Promise<ChargeEntity> {
    await this.chargeModel.updateOne(
      { id: entity.id.value },
      { $set: ChargeModel.fromEntity(entity) },
    );

    return entity;
  }
}
