import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { WebhookTypes } from '@domain/entities';
@Schema()
export class UserWebhookHostModel {
  @Prop({ index: true })
  id!: string;
  @Prop()
  user_id!: string;
  @Prop()
  webhook_host!: string;
  @Prop()
  type!: WebhookTypes;
  @Prop()
  created_at!: Date;
  @Prop()
  updated_at!: Date;
}

export const UserWebhookHostSchema =
  SchemaFactory.createForClass(UserWebhookHostModel);
