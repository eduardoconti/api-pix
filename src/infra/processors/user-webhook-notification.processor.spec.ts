import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Job } from 'bull';

import { WebhookNotificationPayload } from '@app/contracts';

import {
  mockUserWebhookNotificationEntity,
  mockUserWebhookNotificationDeliverdEntity,
  mockUserWebhookNotificationNotDeliverdEntity,
} from '@domain/__mocks__';
import { IUserWebhookNotificationRepository, ILogger } from '@domain/core';
import { ArgumentInvalidException } from '@domain/exceptions';

import { UserWebhookNotificationRepositoryMongo } from '@infra/database/mongo';
import { HttpService, IHttpService } from '@infra/http-service';
import { provideUserWebhookNotificationConsumer } from '@infra/infra.provider';

import { UserWebhookNotificationConsumer } from './user-webhook-notification.processor';

const fakeData: WebhookNotificationPayload = {
  amount: 8000,
  charge_id: '98c713f7-75ec-4726-a542-67af3a750dc6',
  e2e_id: 'EE98c713f775ec4726a54267af3a750dc6',
  notification_id: 'b85381d7-174f-4c0a-a2c8-aa93a399965d',
  provider: 'CELCOIN',
  provider_id: '1001',
  type: 'CHARGE_PAYED',
  url: 'https://webhook.site/98c713f7-75ec-4726-a542-67af3a750dc6',
};
const fakeJob = {
  data: fakeData,
  queue: 'user_webhook_notification',
  id: 'fakeid',
  remove: jest.fn(),
} as unknown as Job<WebhookNotificationPayload>;
describe('UserWebhookNotificationConsumer', () => {
  let webhookConsumer: UserWebhookNotificationConsumer;
  let logger: ILogger;
  let userWebhookNotificationRepository: IUserWebhookNotificationRepository;
  let httpService: IHttpService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        provideUserWebhookNotificationConsumer,
        {
          provide: UserWebhookNotificationRepositoryMongo,
          useValue: {
            findOneById: jest.fn(),
            update: jest.fn(),
          },
        },
        {
          provide: Logger,
          useValue: {
            log: jest.fn(),
            error: jest.fn(),
          },
        },
        {
          provide: HttpService,
          useValue: {
            post: jest.fn(),
          },
        },
      ],
    }).compile();

    webhookConsumer = app.get<UserWebhookNotificationConsumer>(
      UserWebhookNotificationConsumer,
    );
    userWebhookNotificationRepository =
      app.get<IUserWebhookNotificationRepository>(
        UserWebhookNotificationRepositoryMongo,
      );
    logger = app.get<ILogger>(Logger);
    httpService = app.get<IHttpService>(HttpService);
  });

  describe('UserWebhookNotificationConsumer', () => {
    it('should be defined', () => {
      expect(webhookConsumer).toBeDefined();
      expect(userWebhookNotificationRepository).toBeDefined();
      expect(logger).toBeDefined();
      expect(httpService).toBeDefined();
    });
    it('should execute successfully', async () => {
      jest
        .spyOn(userWebhookNotificationRepository, 'findOneById')
        .mockResolvedValue(mockUserWebhookNotificationEntity);

      jest
        .spyOn(userWebhookNotificationRepository, 'update')
        .mockResolvedValue(mockUserWebhookNotificationDeliverdEntity);
      await webhookConsumer.process(fakeJob);
      expect(userWebhookNotificationRepository.findOneById).toBeCalled();
      expect(userWebhookNotificationRepository.update).toBeCalled();
    });

    it('should update attempts when user not receive message', async () => {
      jest
        .spyOn(userWebhookNotificationRepository, 'findOneById')
        .mockResolvedValue(mockUserWebhookNotificationEntity);

      jest
        .spyOn(userWebhookNotificationRepository, 'update')
        .mockResolvedValue(mockUserWebhookNotificationNotDeliverdEntity);
      await webhookConsumer.onQueueFailed(fakeJob, new Error('any'));
      expect(logger.error).toBeCalled();
      expect(userWebhookNotificationRepository.findOneById).toBeCalled();
      expect(fakeJob.remove).not.toBeCalled();
    });

    it('remove job in onQueueFailed if error is istanceof ArgumentInvalidException ', async () => {
      jest
        .spyOn(userWebhookNotificationRepository, 'findOneById')
        .mockResolvedValue(mockUserWebhookNotificationEntity);

      jest
        .spyOn(userWebhookNotificationRepository, 'update')
        .mockResolvedValue(mockUserWebhookNotificationNotDeliverdEntity);
      await webhookConsumer.onQueueFailed(
        fakeJob,
        new ArgumentInvalidException('any'),
      );
      expect(logger.error).toBeCalled();
      expect(fakeJob.remove).toBeCalled();
      expect(userWebhookNotificationRepository.findOneById).toBeCalled();
    });

    it('logger onQueueActive', () => {
      webhookConsumer.onActive(fakeJob);
      expect(logger.log).toBeCalled();
    });
  });
});
