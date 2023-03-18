import {
  ChargeEntity,
  ChargeProps,
  OutboxEntity,
  OutboxProps,
  UserEntity,
  UserProps,
  UserWebhookNotificationEntity,
  UserWebhookNotificationProps,
  WebhookEntity,
} from '@domain/entities';
import { Email } from '@domain/value-objects';

import { ID } from '../value-objects/id.value-object';
import { BaseEntityProps } from './entity';

type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

export type QueryParams<EntityProps> = DeepPartial<
  BaseEntityProps & EntityProps
>;

export interface ISave<Entity> {
  save(entity: Entity): Promise<Entity>;
}

export interface ISaveWithOutbox<Entity, OutboxEntity> {
  saveWithOutbox(entity: Entity, outboxEntity: OutboxEntity): Promise<Entity>;
}

export interface ISaveMultiple<Entity> {
  saveMultiple(entities: Entity[]): Promise<Entity[]>;
}

export interface IUpdate<Entity> {
  update(entity: Entity): Promise<Entity>;
}

export interface IFindOne<Entity, EntityProps> {
  findOne(params: QueryParams<EntityProps>): Promise<Entity>;
}

export interface IFindOneById<Entity> {
  findOneById(id: ID): Promise<Entity>;
}

export interface IFindMany<Entity, EntityProps> {
  findMany(params?: QueryParams<EntityProps>): Promise<Entity[] | []>;
}

export interface IDelete<Entity> {
  delete(entity: Entity): Promise<Entity>;
}
export interface IQuery<Entity> {
  sql(sql: string): Promise<Entity | Entity[] | void>;
}

export interface IChargeRepository
  extends ISave<ChargeEntity>,
    IFindOne<ChargeEntity, ChargeProps>,
    IUpdate<ChargeEntity>,
    IFindMany<ChargeEntity, ChargeProps> {}
export interface IWebhookRepository
  extends ISave<WebhookEntity>,
    ISaveWithOutbox<WebhookEntity, OutboxEntity> {}
export interface IOutboxRepository
  extends ISave<OutboxEntity>,
    IUpdate<OutboxEntity>,
    IFindMany<OutboxEntity, OutboxProps>,
    IFindOne<OutboxEntity, OutboxProps>,
    IQuery<OutboxEntity> {}

export interface IUserRepository
  extends ISave<UserEntity>,
    IUpdate<UserEntity>,
    IFindMany<UserEntity, UserProps>,
    IFindOne<UserEntity, UserProps> {
  exists(email: Email): Promise<boolean>;
}

export interface IUserWebhookNotificationRepository
  extends ISaveWithOutbox<UserWebhookNotificationEntity, OutboxEntity>,
    IUpdate<UserWebhookNotificationEntity>,
    IFindOne<UserWebhookNotificationEntity, UserWebhookNotificationProps> {}

/**
 * From https://github.com/sindresorhus/type-fest/
 * Matches any valid JSON value.
 */
export type JsonValue = string | number | boolean | JsonObject | JsonArray;

export type JsonObject = { [Key in string]?: JsonValue };

export type JsonArray = Array<JsonValue>;
