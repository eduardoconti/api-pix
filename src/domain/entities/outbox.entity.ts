import { AggregateRoot } from '@domain/core';
import { UUID } from '@domain/value-objects';

export type OutboxAggregateType = 'WEBHOOK' | 'CHARGE';
export type OutboxProps = {
  aggregateId: UUID;
  aggregateType: OutboxAggregateType;
  eventId: string;
  payload: string;
  published: boolean;
};

export type OutboxPrimitiveProps = {
  id: string;
  aggregateId: string;
  aggregateType: OutboxAggregateType;
  eventId: string;
  payload: string;
  published: boolean;
};

export class OutboxEntity extends AggregateRoot<OutboxProps> {
  protected readonly _id!: UUID;

  static create(
    props: Omit<OutboxPrimitiveProps, 'id' | 'published'>,
  ): OutboxEntity {
    const id = UUID.generate();
    const { aggregateId, aggregateType, eventId, payload } = props;
    const entity = new OutboxEntity({
      id,
      props: {
        aggregateId: new UUID(aggregateId),
        aggregateType,
        eventId,
        payload,
        published: false,
      },
    });

    return entity;
  }

  markAsPublished(): void {
    this.props.published = true;
  }

  isPending(): boolean {
    return !this.props.published;
  }
}
