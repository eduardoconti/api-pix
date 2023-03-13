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

export class UserModel {
  id!: string;
  name!: string;
  email!: string;
  password!: string;
  status!: UserStatus;
  created_at!: Date;
  updated_at!: Date;
  userWebhookHost!: UserWebhookHostModel[];

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
      userWebhookHost: webhookHost.map((e) => {
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
    userWebhookHost,
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
        webhookHost: userWebhookHost.map(
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
