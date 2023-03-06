import { OutboxAggregateType, OutboxEntity } from '@domain/entities';

export class OutBoxModel {
  id!: string;
  aggregate_id!: string;
  aggregate_type!: OutboxAggregateType;
  event_id!: string;
  payload!: string;
  published!: boolean;

  static fromEntity(entity: OutboxEntity): OutBoxModel {
    return {
      id: entity.id.value,
      aggregate_id: entity.props.aggregateId.value,
      aggregate_type: entity.props.aggregateType,
      event_id: entity.props.eventId,
      payload: entity.props.payload,
      published: entity.props.published,
    };
  }
}
