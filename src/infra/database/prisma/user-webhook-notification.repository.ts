import { IUserWebhookNotificationRepository } from '@domain/core';
import { OutboxEntity, UserWebhookNotificationEntity } from '@domain/entities';
import { UUID } from '@domain/value-objects';

import {
  UserWebhookNotificationNotFoundException,
  UserWebhookNotificationRepositoryException,
} from '@infra/exceptions';

import { OutBoxModel, UserWebhookNotificationModel } from '../models';
import { PrismaService } from './prisma.service';

export class UserWebhookNotificationRepository
  implements IUserWebhookNotificationRepository
{
  constructor(private readonly prismaService: PrismaService) {}

  async saveWithOutbox(
    entity: UserWebhookNotificationEntity,
    outBox: OutboxEntity,
  ): Promise<UserWebhookNotificationEntity> {
    try {
      const userWebhookNotificationModel =
        this.prismaService.user_webhook_notification.create({
          data: UserWebhookNotificationModel.fromEntity(entity),
        });

      const outboxModel = this.prismaService.outbox.create({
        data: OutBoxModel.fromEntity(outBox),
      });

      const [notification] = await this.prismaService.$transaction([
        userWebhookNotificationModel,
        outboxModel,
      ]);
      return UserWebhookNotificationModel.toEntity(
        notification as UserWebhookNotificationModel,
      );
    } catch (e) {
      throw new UserWebhookNotificationRepositoryException(
        'failed to create UserWebhookNotification with outbox on database',
        e,
      );
    }
  }

  async findOneById(id: UUID) {
    const model = await this.prismaService.user_webhook_notification
      .findUnique({
        where: {
          id: id.value,
        },
      })
      .catch((e) => {
        throw new UserWebhookNotificationRepositoryException(
          'failed to find UserWebhookNotification on database',
          e,
        );
      });

    if (!model) {
      throw new UserWebhookNotificationNotFoundException(
        'UserWebhookNotification not found',
      );
    }
    return UserWebhookNotificationModel.toEntity(
      model as UserWebhookNotificationModel,
    );
  }

  async update(entity: UserWebhookNotificationEntity) {
    const model = await this.prismaService.user_webhook_notification
      .update({
        where: {
          id: entity.id.value,
        },
        data: UserWebhookNotificationModel.fromEntity(entity),
      })
      .catch((e) => {
        throw new UserWebhookNotificationRepositoryException(
          'failed to update UserWebhookNotification',
          e,
        );
      });

    return UserWebhookNotificationModel.toEntity(
      model as UserWebhookNotificationModel,
    );
  }

  async findMany() {
    return (await this.prismaService.user_webhook_notification.findMany()).map(
      (e) =>
        UserWebhookNotificationModel.toEntity(
          e as UserWebhookNotificationModel,
        ),
    );
  }
}
