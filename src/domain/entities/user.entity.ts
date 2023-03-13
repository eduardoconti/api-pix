import { AggregateRoot } from '@domain/core';

import { Email, Name, Password, UUID } from '../value-objects';
import {
  UserWebhookHosPrimitivesProps,
  UserWebhookHost,
} from './user-webhook-host.entity';

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
  webhookHost: UserWebhookHost[];
};

export type UserPrimitivesProps = {
  id: string;
  name: string;
  email: string;
  password: string;
  status: UserStatus;
  webhookHost: UserWebhookHosPrimitivesProps[];
  createdAt: Date;
  updatedAt: Date;
};

type CreateUserEntity = Pick<
  UserPrimitivesProps,
  'name' | 'email' | 'password'
> & {
  webhookHost: Pick<UserWebhookHosPrimitivesProps, 'host' | 'type'>[];
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
    return new UserEntity({
      id,
      props: {
        name: new Name(name),
        email: new Email(email),
        password: await Password.hash(password),
        status: UserStatusEnum.ACTIVE,
        webhookHost: webhookHost?.map(({ host, type }) =>
          UserWebhookHost.create({
            userId: id.value,
            host,
            type,
          }),
        ),
      },
    });
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
      webhookHost: props.webhookHost.map(
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
}
