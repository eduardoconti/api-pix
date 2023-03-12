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
  webhookHost?: UserWebhookHost[];
};

export type UserPrimitivesProps = {
  id: string;
  name: string;
  email: string;
  password: string;
  status: UserStatus;
  webhookHost?: UserWebhookHosPrimitivesProps[];
};

export class UserEntity extends AggregateRoot<UserProps> {
  protected readonly _id!: UUID;

  static create({
    name,
    email,
    password,
    status,
    webhookHost,
  }: Omit<UserPrimitivesProps, 'id'>): UserEntity {
    const id = UUID.generate();
    return new UserEntity({
      id,
      props: {
        name: new Name(name),
        email: new Email(email),
        password: new Password(password),
        status,
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
}
