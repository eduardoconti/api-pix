import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { IOutboxRepository, QueryParams } from '@domain/core';
import { OutboxEntity, OutboxProps } from '@domain/entities';

import { OutBoxModel } from '@infra/database/models';
import { OutboxNotFoundException } from '@infra/exceptions';

@Injectable()
export class OutboxRepositoryMongo implements IOutboxRepository {
  constructor(
    @InjectModel(OutBoxModel.name)
    private readonly outboxModel: Model<OutBoxModel>,
  ) {}

  async save(entity: OutboxEntity): Promise<OutboxEntity> {
    const createdOutbox = new this.outboxModel(OutBoxModel.fromEntity(entity));
    const saved = await createdOutbox.save();
    return OutBoxModel.toEntity(saved);
  }

  async findOne(params: QueryParams<OutboxProps>): Promise<OutboxEntity> {
    const outbox = await this.outboxModel.findOne({ id: params.id });

    if (!outbox) {
      throw new OutboxNotFoundException('outbox not found');
    }
    return OutBoxModel.toEntity(outbox);
  }

  async findMany(
    params: QueryParams<OutboxProps>,
  ): Promise<OutboxEntity[] | []> {
    const outboxs = await this.outboxModel.find({
      published: params.published,
      aggregate_type: params.aggregateType,
    });
    return outboxs.map((e) => {
      return OutBoxModel.toEntity(e);
    });
  }

  async update(entity: OutboxEntity): Promise<OutboxEntity> {
    await this.outboxModel.updateOne(
      { id: entity.id.value },
      { $set: OutBoxModel.fromEntity(entity) },
    );

    return entity;
  }

  async sql(): Promise<void | OutboxEntity | OutboxEntity[]> {
    const fourHoursAgo = new Date(Date.now() - 4 * 60 * 60 * 1000);
    const query = { published: true, created_at: { $lt: fourHoursAgo } };
    await this.outboxModel.deleteMany(query);
  }
}
