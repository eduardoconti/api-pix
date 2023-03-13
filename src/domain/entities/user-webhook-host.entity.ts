import { Entity } from '@domain/core';

import { Host, UUID } from '../value-objects';
import { WebhookTypes } from './webhook.entity';

export type UserWebhookHostProps = {
  userId: UUID;
  host: Host;
  type: WebhookTypes;
};

export type UserWebhookHosPrimitivesProps = {
  id: string;
  userId: string;
  host: string;
  type: WebhookTypes;
  createdAt: Date;
  updatedAt: Date;
};

export class UserWebhookHost extends Entity<UserWebhookHostProps> {
  protected readonly _id!: UUID;

  static create({
    userId,
    host,
    type,
  }: Omit<
    UserWebhookHosPrimitivesProps,
    'id' | 'createdAt' | 'updatedAt'
  >): UserWebhookHost {
    const id = UUID.generate();
    return new UserWebhookHost({
      id,
      props: {
        userId: new UUID(userId),
        host: new Host(host),
        type,
      },
    });
  }
}
