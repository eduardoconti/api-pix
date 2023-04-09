import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';

import { IWebhookRepository } from '@domain/core';
import { OutboxEntity, WebhookEntity } from '@domain/entities';

import { OutBoxModel, WebhookModel } from '@infra/database/models';
import { WebhookRepositoryException } from '@infra/exceptions';

@Injectable()
export class WebhookRepositoryMongo implements IWebhookRepository {
  constructor(
    @InjectModel(WebhookModel.name)
    private readonly webhookModel: Model<WebhookModel>,
    @InjectModel(OutBoxModel.name)
    private readonly outboxModel: Model<OutBoxModel>,
    @InjectConnection() private readonly connection: mongoose.Connection,
  ) {}

  async save(entity: WebhookEntity): Promise<WebhookEntity> {
    const createdCat = new this.webhookModel(WebhookModel.fromEntity(entity));
    const saved = await createdCat.save();
    return WebhookModel.toEntity(saved);
  }

  async saveWithOutbox(
    entity: WebhookEntity,
    outboxEntity: OutboxEntity,
  ): Promise<WebhookEntity> {
    const session = await this.connection.startSession();

    session.startTransaction();
    try {
      const createdCat = new this.webhookModel(WebhookModel.fromEntity(entity));
      const saved = await createdCat.save();
      const outbox = new this.outboxModel(OutBoxModel.fromEntity(outboxEntity));
      await outbox.save();
      await session.commitTransaction();
      return WebhookModel.toEntity(saved);
    } catch (error) {
      await session.abortTransaction();
      throw new WebhookRepositoryException('failed to save with outbox');
    } finally {
      session.endSession();
    }
  }
}
