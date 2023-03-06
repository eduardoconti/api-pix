import { Injectable } from '@nestjs/common';

import { IChargeRepository } from '@domain/core/repository';
import { ChargeEntity, ChargeProps } from '@domain/entities';

import { ChargeRepositoryException } from '@infra/exceptions';

import { ChargeModel } from './models';
import { PrismaService } from './prisma.service';

@Injectable()
export class ChargeRepository implements IChargeRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async save(entity: ChargeEntity): Promise<ChargeEntity> {
    try {
      const saved = await this.prismaService.charge.create({
        data: ChargeModel.fromEntity(entity),
      });
      return ChargeModel.toEntity(saved);
    } catch (e) {
      console.log(e);
      throw new ChargeRepositoryException(
        'failed to create charge on database',
        e,
      );
    }
  }

  async findOne(props: ChargeProps): Promise<ChargeEntity> {
    try {
      const model = await this.prismaService.charge.findFirst({
        where: {
          provider_id: props.providerId,
        },
      });
      if (!model) {
        throw new ChargeRepositoryException('charge not found!');
      }
      return ChargeModel.toEntity(model as any);
    } catch (error) {
      throw new ChargeRepositoryException(
        'failed to find charge on database',
        error,
      );
    }
  }

  async update(entity: ChargeEntity): Promise<ChargeEntity> {
    try {
      const updated = await this.prismaService.charge.update({
        data: ChargeModel.fromEntity(entity),
        where: {
          id: entity.id.value,
        },
      });
      return ChargeModel.toEntity(updated);
    } catch (error) {
      throw new ChargeRepositoryException(
        'failed to update charge on database',
        error,
      );
    }
  }
}
