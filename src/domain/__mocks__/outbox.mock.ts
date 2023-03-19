import { AggregateTypeEnum, OutboxEntity } from '@domain/entities';
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
    payload:
      '{"id":"b3a686a2-252e-4f6a-9aee-2b3bdcd59987","payload":"{\\"RequestBody\\":{\\"TransactionType\\":\\"RECEIVEPIX\\",\\"TransactionId\\":817432470,\\"Amount\\":80,\\"DebitParty\\":{\\"Account\\":\\"416781236\\",\\"Bank\\":\\"18236120\\",\\"Branch\\":\\"1\\",\\"PersonType\\":\\"NATURAL_PERSON\\",\\"TaxId\\":\\"01234567890\\",\\"AccountType\\":\\"CACC\\",\\"Name\\":\\"Eduardo Conti\\"},\\"CreditParty\\":{\\"Bank\\":\\"18236120\\",\\"Branch\\":\\"1\\",\\"Account\\":\\"416781236\\",\\"PersonType\\":\\"NATURAL_PERSON\\",\\"TaxId\\":\\"01234567890\\",\\"AccountType\\":\\"CACC\\",\\"Name\\":\\"Eduardo Conti\\",\\"Key\\":\\"8ea152b1-ddee-ssaa-aass-ce98245349aa\\"},\\"EndToEndId\\":\\"E18236120202001199999s0149012FPC\\",\\"transactionIdentification\\":\\"kk6g232xel65a0daee4dd13kk54578675\\",\\"transactionIdBRCode\\":\\"54578675\\"}}","provider":"CELCOIN","provider_id":"817432470","amount":8000,"type":"CHARGE_PAYED","created_at":"2023-03-07T11:05:29.993Z","updated_at":"2023-03-07T11:05:29.993Z","e2e_id":"E18236120202001199999s0149012FPC"}',
  },
});

export const mockOutboxUserWebhookNotificationEntity = new OutboxEntity({
  id: new UUID('b85381d7-174f-4c0a-a2c8-aa93a399965d'),
  createdAt: new DateVO(new Date()),
  updatedAt: new DateVO(new Date()),
  props: {
    aggregateId: new UUID('b85381d7-174f-4c0a-a2c8-aa93a399965d'),
    aggregateType: AggregateTypeEnum.USER_WEBHOOK_NOTIFICATION,
    eventId: 'kk6g232xel65a0daee4dd13kk817433576',
    published: false,
    payload:
      '{"charge_id":"e5bba55c-e51c-47c5-95ba-04e0191db8f7","e2e_id":"EE7affbce5-76ef-4e63-931f-9394ea434464","provider":"CELCOIN","provider_id":"422253ceeccf3a7cff193d05d40e75f3","url":"https://webhook.site/98c713f7-75ec-4726-a542-67af3a750dc6","type":"CHARGE_PAYED","notification_id":"3164864a-5699-4d5f-98c0-357a98047862","amount":8000}',
  },
});
