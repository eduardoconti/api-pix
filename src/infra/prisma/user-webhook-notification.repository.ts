import { IUserWebhookNotificationRepository, QueryParams } from '@domain/core';
import {
  OutboxEntity,
  UserWebhookNotificationEntity,
  UserWebhookNotificationProps,
} from '@domain/entities';

import { UserWebhookNotificationRepositoryException } from '@infra/exceptions';

import { OutBoxModel, UserWebhookNotificationModel } from './models';
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
      const webhookEntity = this.prismaService.user_webhook_notification.create(
        {
          data: UserWebhookNotificationModel.fromEntity(entity),
        },
      );

      const outBoxEntity = this.prismaService.outbox.create({
        data: OutBoxModel.fromEntity(outBox),
      });

      const [webhook] = await this.prismaService.$transaction([
        webhookEntity,
        outBoxEntity,
      ]);
      return UserWebhookNotificationModel.toEntity(
        webhook as UserWebhookNotificationModel,
      );
    } catch (e) {
      throw new UserWebhookNotificationRepositoryException(
        'failed to create UserWebhookNotification with outbox on database',
        e,
      );
    }
  }

  async findOne(params: QueryParams<UserWebhookNotificationProps>) {
    const model = await this.prismaService.user_webhook_notification
      .findFirst({
        where: {
          id: params?.id?.value,
        },
      })
      .catch((e) => {
        throw new UserWebhookNotificationRepositoryException(
          'failed to find UserWebhookNotification on database',
          e,
        );
      });

    if (!model) {
      throw new UserWebhookNotificationRepositoryException(
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
}
