import {
  UserEntity,
  UserWebhookHost,
  UserWebhookNotificationEntity,
  UserWebhookNotificationPayload,
} from '@domain/entities';
import {
  DateVO,
  Email,
  Host,
  Name,
  Password,
  UUID,
} from '@domain/value-objects';

export const mockUserEntity = new UserEntity({
  id: new UUID('b85381d7-174f-4c0a-a2c8-aa93a399965d'),
  createdAt: new DateVO(new Date()),
  updatedAt: new DateVO(new Date()),
  props: {
    name: new Name('Eduardo Conti'),
    email: new Email('es.eduardoconti@gmail.com'),
    password: new Password(
      '$2b$10$QpOBIm7/vj8Xj07uQElgK.hWowRENs/qhHiDJsCtwIh5zxxobVzG2',
    ),
    status: 'ACTIVE',
    webhookHost: [
      new UserWebhookHost({
        id: new UUID('c85381d7-174f-4c0a-a2c8-aa93a399965d'),
        createdAt: new DateVO(new Date()),
        updatedAt: new DateVO(new Date()),
        props: {
          host: new Host('https://www.google.com.br'),
          type: 'CHARGE_PAYED',
          userId: new UUID('b85381d7-174f-4c0a-a2c8-aa93a399965d'),
        },
      }),
    ],
  },
});

export const mockUserEntityWithoutHost = new UserEntity({
  id: new UUID('b85381d7-174f-4c0a-a2c8-aa93a399965d'),
  createdAt: new DateVO(new Date()),
  updatedAt: new DateVO(new Date()),
  props: {
    name: new Name('Eduardo Conti'),
    email: new Email('es.eduardoconti@gmail.com'),
    password: new Password('teste@123'),
    status: 'ACTIVE',
    webhookHost: undefined,
  },
});

export const chargePayedDomainEvent: UserWebhookNotificationPayload = {
  chargeId: 'fd700cff-8dfe-46a1-9069-3ba0b7fa113f',
  amount: 8000,
  e2eId: 'EE0e360935-b38a-4f4f-8978-2fd5ebb5759b',
  provider: 'CELCOIN',
  providerId: '123',
};
export const mockUserWebhookNotificationEntity =
  new UserWebhookNotificationEntity({
    id: new UUID('b85381d7-174f-4c0a-a2c8-aa93a399965d'),
    createdAt: new DateVO(new Date()),
    updatedAt: new DateVO(new Date()),
    props: {
      attempts: 0,
      type: 'CHARGE_PAYED',
      userId: new UUID('b85381d7-174f-4c0a-a2c8-aa93a399965d'),
      chargeId: new UUID('b85381d7-174f-4c0a-a2c8-aa93a399965d'),
      payload: chargePayedDomainEvent,
      deliverdAt: undefined,
    },
  });

export const mockUserWebhookNotificationDeliverdEntity =
  new UserWebhookNotificationEntity({
    id: new UUID('b85381d7-174f-4c0a-a2c8-aa93a399965d'),
    createdAt: new DateVO(new Date()),
    updatedAt: new DateVO(new Date()),
    props: {
      attempts: 1,
      type: 'CHARGE_PAYED',
      userId: new UUID('b85381d7-174f-4c0a-a2c8-aa93a399965d'),
      chargeId: new UUID('b85381d7-174f-4c0a-a2c8-aa93a399965d'),
      payload: chargePayedDomainEvent,
      deliverdAt: new DateVO(new Date()),
    },
  });

export const mockUserWebhookNotificationNotDeliverdEntity =
  new UserWebhookNotificationEntity({
    id: new UUID('b85381d7-174f-4c0a-a2c8-aa93a399965d'),
    createdAt: new DateVO(new Date()),
    updatedAt: new DateVO(new Date()),
    props: {
      attempts: 1,
      type: 'CHARGE_PAYED',
      userId: new UUID('b85381d7-174f-4c0a-a2c8-aa93a399965d'),
      chargeId: new UUID('b85381d7-174f-4c0a-a2c8-aa93a399965d'),
      payload: chargePayedDomainEvent,
      deliverdAt: undefined,
    },
  });
