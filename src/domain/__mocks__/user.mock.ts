import { UserEntity, UserWebhookHost } from '@domain/entities';
import {
  DateVO,
  Email,
  Host,
  Name,
  Password,
  UUID,
} from '@domain/value-objects';

export const userEntityMock = new UserEntity({
  id: new UUID('b85381d7-174f-4c0a-a2c8-aa93a399965d'),
  createdAt: new DateVO(new Date()),
  updatedAt: new DateVO(new Date()),
  props: {
    name: new Name('Eduardo Conti'),
    email: new Email('es.eduardoconti@gmail.com'),
    password: new Password('teste@123'),
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
