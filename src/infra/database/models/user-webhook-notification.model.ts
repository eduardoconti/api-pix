import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import GraphQLJSON from 'graphql-type-json';

import { UserWebhookNotificationEntity, WebhookTypes } from '@domain/entities';
import { DateVO, UUID } from '@domain/value-objects';

@Schema()
@ObjectType()
export class UserWebhookNotificationModel {
  @Field(() => ID)
  @Prop({ index: true })
  id!: string;
  @Prop()
  @Field()
  user_id!: string;
  @Prop()
  @Field()
  type!: WebhookTypes;
  @Prop()
  @Field()
  charge_id!: string;
  @Field(() => GraphQLJSON)
  @Prop({ type: Object })
  payload!: string;
  @Prop()
  @Field()
  attempts!: number;
  @Prop({ required: false, type: 'date' })
  @Field(() => Date, { nullable: true })
  delivered_at!: Date | null;
  @Prop()
  @Field()
  created_at!: Date;
  @Prop()
  @Field()
  updated_at!: Date;

  static fromEntity(
    entity: UserWebhookNotificationEntity,
  ): UserWebhookNotificationModel {
    return {
      id: entity.id.value,
      user_id: entity.props.userId.value,
      payload: JSON.stringify(entity.props.payload),
      attempts: entity.props.attempts,
      charge_id: entity.props.chargeId.value,
      type: entity.props.type,
      created_at: entity.createdAt.value,
      updated_at: entity.updatedAt.value,
      delivered_at: entity.props.deliverdAt?.value ?? null,
    };
  }

  static toEntity(
    model: UserWebhookNotificationModel,
  ): UserWebhookNotificationEntity {
    const {
      id,
      created_at,
      updated_at,
      payload,
      user_id,
      charge_id,
      type,
      attempts,
      delivered_at,
    } = model;
    return new UserWebhookNotificationEntity({
      id: new UUID(id),
      createdAt: new DateVO(created_at),
      updatedAt: new DateVO(updated_at),
      props: {
        type,
        payload: JSON.parse(payload),
        userId: new UUID(user_id),
        chargeId: new UUID(charge_id),
        attempts,
        deliverdAt: delivered_at ? new DateVO(delivered_at) : undefined,
      },
    });
  }
}

export const UserWebhookNotificationSchema = SchemaFactory.createForClass(
  UserWebhookNotificationModel,
);
