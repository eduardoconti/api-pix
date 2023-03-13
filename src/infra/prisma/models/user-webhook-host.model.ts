import { WebhookTypes } from '@domain/entities';

export class UserWebhookHostModel {
  id!: string;
  user_id!: string;
  webhook_host!: string;
  type!: WebhookTypes;
  created_at!: Date;
  updated_at!: Date;
}
