import { WebhookNotificationPayload } from '@app/contracts';

import { mockWebhookEntity } from '@domain/__mocks__/webhook.mock';
import {
  AggregateTypeEnum,
  OutboxEntity,
  WebhookTypesEnum,
} from '@domain/entities';
import { DateVO, UUID } from '@domain/value-objects';

export const mockOutboxEntity = new OutboxEntity({
  id: new UUID('b85381d7-174f-4c0a-a2c8-aa93a399965d'),
  createdAt: new DateVO(new Date()),
  updatedAt: new DateVO(new Date()),
  props: {
    aggregateId: new UUID('b85381d7-174f-4c0a-a2c8-aa93a399965d'),
    aggregateType: AggregateTypeEnum.WEBHOOK,
    eventId: 'kk6g232xel65a0daee4dd13kk817433576',
    published: false,
    payload: JSON.stringify(mockWebhookEntity),
  },
});

export const mockUserNotificationPayload: WebhookNotificationPayload = {
  charge_id: 'b85381d7-174f-4c0a-a2c8-aa93a399965d',
  e2e_id: 'EE79e25187-883e-4a1d-aebd-8d0e181d7417',
  provider: 'CELCOIN',
  provider_id: '817627648',
  url: 'https://google.com',
  type: WebhookTypesEnum.CHARGE_PAYED,
  notification_id: 'b3a686a2-252e-4f6a-9aee-2b3bdcd59987',
  amount: 8000,
};

export const mockOutboxUserWebhookNotificationEntity = new OutboxEntity({
  id: new UUID('b85381d7-174f-4c0a-a2c8-aa93a399965d'),
  createdAt: new DateVO(new Date()),
  updatedAt: new DateVO(new Date()),
  props: {
    aggregateId: new UUID('b85381d7-174f-4c0a-a2c8-aa93a399965d'),
    aggregateType: AggregateTypeEnum.USER_WEBHOOK_NOTIFICATION,
    eventId: 'kk6g232xel65a0daee4dd13kk817433576',
    published: false,
    payload: JSON.stringify(mockUserNotificationPayload),
  },
});
