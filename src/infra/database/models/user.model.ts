import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { UserEntity, UserStatus, UserWebhookHost } from '@domain/entities';
import {
  DateVO,
  Email,
  Host,
  Name,
  Password,
  UUID,
} from '@domain/value-objects';

import { UserWebhookHostModel } from './user-webhook-host.model';

@Schema()
export class UserModel {
  @Prop({ index: true })
  id!: string;
  @Prop()
  name!: string;
  @Prop()
  email!: string;
  @Prop()
  password!: string;
  @Prop()
  status!: UserStatus;
  @Prop()
  created_at!: Date;
  @Prop()
  updated_at!: Date;
  @Prop({
    type: [{ type: Object }],
  })
  user_webhook_host?: UserWebhookHostModel[];

  static fromEntity(userEntity: UserEntity): UserModel {
    const {
      id,
      name,
      email,
      password,
      status,
      webhookHost,
      createdAt,
      updatedAt,
    } = UserEntity.toPrimitives(userEntity);

    return {
      id,
      name,
      email,
      password,
      status,
      user_webhook_host: webhookHost?.map((e) => {
        return {
          id: e.id,
          webhook_host: e.host,
          type: e.type,
          user_id: e.userId,
          created_at: e.createdAt,
          updated_at: e.updatedAt,
        };
      }),
      created_at: createdAt,
      updated_at: updatedAt,
    };
  }

  static toEntity({
    id,
    name,
    email,
    password,
    status,
    created_at,
    updated_at,
    user_webhook_host,
  }: UserModel): UserEntity {
    return new UserEntity({
      id: new UUID(id),
      createdAt: new DateVO(created_at),
      updatedAt: new DateVO(updated_at),
      props: {
        name: new Name(name),
        email: new Email(email),
        password: new Password(password),
        status,
        webhookHost: user_webhook_host?.map(
          ({ id, webhook_host, created_at, type, updated_at, user_id }) => {
            return new UserWebhookHost({
              id: new UUID(id),
              createdAt: new DateVO(created_at),
              updatedAt: new DateVO(updated_at),
              props: {
                host: new Host(webhook_host),
                type,
                userId: new UUID(user_id),
              },
            });
          },
        ),
      },
    });
  }
}

export const UserSchema = SchemaFactory.createForClass(UserModel);
