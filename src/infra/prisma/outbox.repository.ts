import { Injectable } from '@nestjs/common';

import { IOutboxRepository, QueryParams } from '@domain/core/repository';
import { OutboxEntity, OutboxProps } from '@domain/entities';

import { OutboxRepositoryException } from '@infra/exceptions';

import { OutBoxModel } from './models';
import { PrismaService } from './prisma.service';

@Injectable()
export class OutboxRepository implements IOutboxRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async save(entity: OutboxEntity): Promise<OutboxEntity> {
    try {
      const saved = await this.prismaService.outbox.create({
        data: OutBoxModel.fromEntity(entity),
      });
      return OutBoxModel.toEntity(saved as OutBoxModel);
    } catch (e) {
      throw new OutboxRepositoryException(
        'failed to create outbox on database',
        e,
      );
    }
  }

  async findOne(params: QueryParams<OutboxProps>) {
    const model = await this.prismaService.outbox
      .findFirst({
        where: {
          id: params?.id?.value,
        },
      })
      .catch((e) => {
        throw new OutboxRepositoryException(
          'failed to find outbox on database',
          e,
        );
      });
    return OutBoxModel.toEntity(model as OutBoxModel);
  }

  async findMany(params: QueryParams<OutboxProps>) {
    const models = await this.prismaService.outbox
      .findMany({
        where: {
          published: params?.published,
          aggregate_type: params?.aggregateType,
          aggregate_id: params?.aggregateId?.value,
        },
      })
      .catch((e) => {
        throw new OutboxRepositoryException(
          'failed to findMany outbox on database',
          e,
        );
      });
    return models.map((e) => OutBoxModel.toEntity(e as OutBoxModel));
  }

  async update(entity: OutboxEntity): Promise<OutboxEntity> {
    try {
      const saved = await this.prismaService.outbox.update({
        data: OutBoxModel.fromEntity(entity),
        where: { id: entity.id.value },
      });
      return OutBoxModel.toEntity(saved as OutBoxModel);
    } catch (e) {
      throw new OutboxRepositoryException(
        'failed to create outbox on database',
        e,
      );
    }
  }
}
