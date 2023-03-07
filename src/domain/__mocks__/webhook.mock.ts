import { OutboxEntity, WebhookEntity } from '@domain/entities';
import { Amount, DateVO, UUID } from '@domain/value-objects';

export const mockWebhookEntity = new WebhookEntity({
  id: new UUID('b85381d7-174f-4c0a-a2c8-aa93a399965d'),
  createdAt: new DateVO(new Date()),
  updatedAt: new DateVO(new Date()),
  props: {
    provider: 'CELCOIN',
    providerId: '817428956',
    type: 'CHARGE_PAYED',
    amount: new Amount(8000),
    e2eId: 'E18236120202001199999s0149012FPC',
    payload:
      '{"RequestBody":{"TransactionType":"RECEIVEPIX","TransactionId":56762766,"Amount":150.55,"DebitParty":{"Account":"416781236","Bank":"18236120","Branch":"1","PersonType":"NATURAL_PERSON","TaxId":"01234567890","AccountType":"CACC","Name":"Eduardo Conti"},"CreditParty":{"Bank":"18236120","Branch":"1","Account":"416781236","PersonType":"NATURAL_PERSON","TaxId":"01234567890","AccountType":"CACC","Name":"Eduardo Conti","Key":"8ea152b1-ddee-ssaa-aass-ce98245349aa"},"EndToEndId":"E18236120202001199999s0149012FPC","transactionIdentification":"kk6g232xel65a0daee4dd13kk54578675","transactionIdBRCode":"54578675"}}',
  },
});

export const mockOutboxEntity = new OutboxEntity({
  id: new UUID('b85381d7-174f-4c0a-a2c8-aa93a399965d'),
  createdAt: new DateVO(new Date()),
  updatedAt: new DateVO(new Date()),
  props: {
    aggregateId: new UUID('b85381d7-174f-4c0a-a2c8-aa93a399965d'),
    aggregateType: 'WEBHOOK',
    eventId: 'SGJYCCsrthCKDwj1XAcrm',
    payload:
      '{"endToEndId":"E18236120202001199999s0149012FPC","provider":"CELCOIN","providerId":"56762766","type":"CHARGE_PAYED","providerJson":"{\\"RequestBody\\":{\\"TransactionType\\":\\"RECEIVEPIX\\",\\"TransactionId\\":56762766,\\"Amount\\":150.55,\\"DebitParty\\":{\\"Account\\":\\"416781236\\",\\"Bank\\":\\"18236120\\",\\"Branch\\":\\"1\\",\\"PersonType\\":\\"NATURAL_PERSON\\",\\"TaxId\\":\\"01234567890\\",\\"AccountType\\":\\"CACC\\",\\"Name\\":\\"Eduardo Conti\\"},\\"CreditParty\\":{\\"Bank\\":\\"18236120\\",\\"Branch\\":\\"1\\",\\"Account\\":\\"416781236\\",\\"PersonType\\":\\"NATURAL_PERSON\\",\\"TaxId\\":\\"01234567890\\",\\"AccountType\\":\\"CACC\\",\\"Name\\":\\"Eduardo Conti\\",\\"Key\\":\\"8ea152b1-ddee-ssaa-aass-ce98245349aa\\"},\\"EndToEndId\\":\\"E18236120202001199999s0149012FPC\\",\\"transactionIdentification\\":\\"kk6g232xel65a0daee4dd13kk54578675\\",\\"transactionIdBRCode\\":\\"54578675\\"}}"}',
    published: false,
  },
});
