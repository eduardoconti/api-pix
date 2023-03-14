import { AggregateRoot } from '@domain/core';
import { ArgumentInvalidException } from '@domain/exceptions';

import { Email, Name, Password, UUID } from '../value-objects';
import {
  UserWebhookHosPrimitivesProps,
  UserWebhookHost,
} from './user-webhook-host.entity';
import { WebhookTypesEnum } from './webhook.entity';

export enum UserStatusEnum {
  ACTIVE = 'ACTIVE',
  DISABLED = 'DISABLED',
}

export type UserStatus = keyof typeof UserStatusEnum;

export type UserProps = {
  name: Name;
  email: Email;
  password: Password;
  status: UserStatus;
  webhookHost?: UserWebhookHost[];
};

export type UserPrimitivesProps = {
  id: string;
  name: string;
  email: string;
  password: string;
  status: UserStatus;
  webhookHost?: UserWebhookHosPrimitivesProps[];
  createdAt: Date;
  updatedAt: Date;
};

type CreateUserEntity = Pick<
  UserPrimitivesProps,
  'name' | 'email' | 'password'
> & {
  webhookHost?: Pick<UserWebhookHosPrimitivesProps, 'host' | 'type'>[];
};

export class UserEntity extends AggregateRoot<UserProps> {
  protected readonly _id!: UUID;

  static async create({
    name,
    email,
    password,
    webhookHost,
  }: CreateUserEntity): Promise<UserEntity> {
    const id = UUID.generate();
    const entity = new UserEntity({
      id,
      props: {
        name: new Name(name),
        email: new Email(email),
        password: await Password.hash(password),
        status: UserStatusEnum.ACTIVE,
      },
    });

    if (webhookHost && webhookHost.length) {
      entity.addWebhookHost(webhookHost);
    }
    return entity;
  }

  static toPrimitives({
    id,
    props,
    createdAt,
    updatedAt,
  }: UserEntity): UserPrimitivesProps {
    return {
      id: id.value,
      name: props.name.value,
      email: props.email.value,
      password: props.password.value,
      status: props.status,
      webhookHost: props.webhookHost?.map(
        ({ props: { host, type, userId }, createdAt, updatedAt, id }) => {
          return {
            id: id.value,
            host: host.value,
            type,
            userId: userId.value,
            createdAt: createdAt.value,
            updatedAt: updatedAt.value,
          };
        },
      ),
      createdAt: createdAt.value,
      updatedAt: updatedAt.value,
    };
  }

  addWebhookHost(
    webhookHost: Pick<UserWebhookHosPrimitivesProps, 'host' | 'type'>[],
  ): void {
    const webhookTypesUtilized: Record<WebhookTypesEnum, boolean> = {
      CHARGE_PAYED: false,
      CHARGE_REFUNDED: false,
    };

    webhookHost.forEach(({ type }) => {
      if (webhookTypesUtilized[type]) {
        throw new ArgumentInvalidException(`duplicated webhook type ${type}`);
      }

      webhookTypesUtilized[type] = true;

      this.props.webhookHost = webhookHost.map(({ host, type }) =>
        UserWebhookHost.create({
          userId: this.id.value,
          host,
          type,
        }),
      );
    });
  }
}
