import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';

import { IUserWebhookNotificationRepository } from '@domain/core';
import { OutboxEntity, UserWebhookNotificationEntity } from '@domain/entities';
import { Email, ID } from '@domain/value-objects';

import {
  OutBoxModel,
  UserWebhookNotificationModel,
} from '@infra/database/models';
import {
  UserWebhookNotificationNotFoundException,
  UserWebhookNotificationRepositoryException,
} from '@infra/exceptions';

@Injectable()
export class UserWebhookNotificationRepositoryMongo
  implements IUserWebhookNotificationRepository
{
  constructor(
    @InjectModel(UserWebhookNotificationModel.name)
    private readonly userWebhookNotificationModel: Model<UserWebhookNotificationModel>,
    @InjectModel(OutBoxModel.name)
    private readonly outboxModel: Model<OutBoxModel>,
    @InjectConnection() private readonly connection: mongoose.Connection,
  ) {}

  async saveWithOutbox(
    entity: UserWebhookNotificationEntity,
    outboxEntity: OutboxEntity,
  ): Promise<UserWebhookNotificationEntity> {
    const session = await this.connection.startSession();
    try {
      session.startTransaction();
      const createdCat = new this.userWebhookNotificationModel(
        UserWebhookNotificationModel.fromEntity(entity),
      );
      const saved = await createdCat.save();
      const outbox = new this.outboxModel(OutBoxModel.fromEntity(outboxEntity));
      await outbox.save();
      return UserWebhookNotificationModel.toEntity(saved);
    } catch (error) {
      await session.abortTransaction();
      throw new UserWebhookNotificationRepositoryException(
        'failed to save with outbox',
      );
    } finally {
      session.endSession();
    }
  }

  async exists(email: Email): Promise<boolean> {
    const userWebhookNotification =
      await this.userWebhookNotificationModel.findOne({ email: email.value });

    if (!userWebhookNotification) {
      return false;
    }
    return true;
  }

  async findOneById(id: ID): Promise<UserWebhookNotificationEntity> {
    const userWebhookNotification =
      await this.userWebhookNotificationModel.findOne({ id: id.value });

    if (!userWebhookNotification) {
      throw new UserWebhookNotificationNotFoundException(
        'userWebhookNotification not found',
      );
    }
    return UserWebhookNotificationModel.toEntity(userWebhookNotification);
  }

  async update(
    entity: UserWebhookNotificationEntity,
  ): Promise<UserWebhookNotificationEntity> {
    await this.userWebhookNotificationModel.updateOne(
      { id: entity.id.value },
      { $set: UserWebhookNotificationModel.fromEntity(entity) },
    );

    return entity;
  }
}
