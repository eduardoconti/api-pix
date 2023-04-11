import { Inject, UseGuards } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';

import { TokenPayload } from '@app/contracts';

import { IChargeRepository } from '@domain/core';
import { ChargeStatus } from '@domain/entities';
import { UUID } from '@domain/value-objects';

import { ChargeModel } from '@infra/database/models';
import { ChargeRepositoryMongo } from '@infra/database/mongo';
import { User } from '@infra/decorators';
import { GqlAuthGuard } from '@infra/guard';

@Resolver(() => ChargeModel)
export class ChargeResolver {
  constructor(
    @Inject(ChargeRepositoryMongo)
    private readonly chargeRepository: IChargeRepository,
  ) {}
  @Query(() => [ChargeModel])
  @UseGuards(GqlAuthGuard)
  async findAll(@User() user: TokenPayload): Promise<ChargeModel[]> {
    const result = await this.chargeRepository.findMany({
      userId: new UUID(user.userId),
    });
    return result.map((e) => ChargeModel.fromEntity(e));
  }

  @Query(() => [ChargeModel])
  @UseGuards(GqlAuthGuard)
  async findByStatus(
    @User() user: TokenPayload,
    @Args('status', { type: () => String }) status: ChargeStatus,
  ): Promise<ChargeModel[]> {
    const result = await this.chargeRepository.findMany({
      status: status,
      userId: new UUID(user.userId),
    });
    return result.map((e) => ChargeModel.fromEntity(e));
  }
}
