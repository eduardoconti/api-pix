import {
  ChargeEntity,
  ChargeProps,
  OutboxEntity,
  OutboxProps,
  WebhookEntity,
} from '@domain/entities';

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
    IUpdate<ChargeEntity> {}
export interface IWebhookRepository
  extends ISave<WebhookEntity>,
    ISaveWithOutbox<WebhookEntity, OutboxEntity> {}
export interface IOutboxRepository
  extends ISave<OutboxEntity>,
    IUpdate<OutboxEntity>,
    IFindMany<OutboxEntity, OutboxProps>,
    IFindOne<OutboxEntity, OutboxProps>,
    IQuery<OutboxEntity> {}
