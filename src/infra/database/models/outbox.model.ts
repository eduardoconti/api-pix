import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { OutboxAggregateType, OutboxEntity } from '@domain/entities';
import { DateVO, UUID } from '@domain/value-objects';

@Schema()
export class OutBoxModel {
  @Prop({ unique: true })
  id!: string;
  @Prop()
  aggregate_id!: string;
  @Prop({ index: true })
  aggregate_type!: OutboxAggregateType;
  @Prop()
  event_id!: string;
  @Prop()
  payload!: string;
  @Prop({ index: true })
  published!: boolean;
  @Prop()
  created_at!: Date;
  @Prop()
  updated_at!: Date;

  static fromEntity(entity: OutboxEntity): OutBoxModel {
    return {
      id: entity.id.value,
      aggregate_id: entity.props.aggregateId.value,
      aggregate_type: entity.props.aggregateType,
      event_id: entity.props.eventId,
      payload: entity.props.payload,
      published: entity.props.published,
      created_at: entity.createdAt.value,
      updated_at: entity.updatedAt.value,
    };
  }

  static toEntity(model: OutBoxModel): OutboxEntity {
    const {
      id,
      created_at,
      updated_at,
      aggregate_id,
      aggregate_type,
      event_id,
      payload,
      published,
    } = model;
    return new OutboxEntity({
      id: new UUID(id),
      createdAt: new DateVO(created_at),
      updatedAt: new DateVO(updated_at),
      props: {
        aggregateId: new UUID(aggregate_id),
        aggregateType: aggregate_type,
        eventId: event_id,
        payload: payload,
        published,
      },
    });
  }
}
export const OutboxSchema = SchemaFactory.createForClass(OutBoxModel);
