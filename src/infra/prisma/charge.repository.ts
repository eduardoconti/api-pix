import { Injectable } from '@nestjs/common';

import { IChargeRepository } from '@domain/core/repository';
import { ChargeEntity } from '@domain/entities';

import { ChargeRepositoryException } from '@infra/exceptions';

import { ChargeModel } from './models';
import { PrismaService } from './prisma.service';

@Injectable()
export class ChargeRepository implements IChargeRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async save(entity: ChargeEntity): Promise<ChargeEntity> {
    try {
      await this.prismaService.charge.create({
        data: ChargeModel.fromEntity(entity),
      });
    } catch (e) {
      throw new ChargeRepositoryException(
        'failed to create charge on database',
        e,
      );
    }
    return entity;
  }
}
