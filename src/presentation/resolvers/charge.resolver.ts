import { Inject } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';

import { IChargeRepository } from '@domain/core';
import { ChargeStatus } from '@domain/entities';

import { ChargeModel } from '@infra/database/models';
import { ChargeRepositoryMongo } from '@infra/database/mongo';

@Resolver(() => ChargeModel)
export class ChargeResolver {
  constructor(
    @Inject(ChargeRepositoryMongo)
    private readonly chargeRepository: IChargeRepository,
  ) {}
  @Query(() => [ChargeModel])
  async findAll(): Promise<ChargeModel[]> {
    const result = await this.chargeRepository.findMany();
    return result.map((e) => ChargeModel.fromEntity(e));
  }

  @Query(() => [ChargeModel])
  async findByStatus(
    @Args('status', { type: () => String }) status: ChargeStatus,
  ): Promise<ChargeModel[]> {
    const result = await this.chargeRepository.findMany({ status: status });
    return result.map((e) => ChargeModel.fromEntity(e));
  }
}
