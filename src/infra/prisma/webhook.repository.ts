import { Injectable } from '@nestjs/common';

import { IWebhookRepository } from '@domain/core/repository';
import { OutboxEntity, WebhookEntity } from '@domain/entities';

import { WebhookRepositoryException } from '@infra/exceptions';

import { OutBoxModel, WebhookModel } from './models';
import { PrismaService } from './prisma.service';

@Injectable()
export class WebhookRepository implements IWebhookRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async save(entity: WebhookEntity): Promise<WebhookEntity> {
    try {
      await this.prismaService.webhook.create({
        data: WebhookModel.fromEntity(entity),
      });
    } catch (e) {
      throw new WebhookRepositoryException(
        'failed to create webhook on database',
        e,
      );
    }
    return entity;
  }

  async saveWithOutbox(
    entity: WebhookEntity,
    outBox: OutboxEntity,
  ): Promise<WebhookEntity> {
    try {
      const webhookEntity = this.prismaService.webhook.create({
        data: WebhookModel.fromEntity(entity),
      });

      const outBoxEntity = this.prismaService.outbox.create({
        data: OutBoxModel.fromEntity(outBox),
      });

      const [webhook] = await this.prismaService.$transaction([
        webhookEntity,
        outBoxEntity,
      ]);
      return WebhookModel.toEntity(webhook as WebhookModel);
    } catch (e) {
      throw new WebhookRepositoryException(
        'failed to create webhook with outbox on database',
        e,
      );
    }
  }
}
