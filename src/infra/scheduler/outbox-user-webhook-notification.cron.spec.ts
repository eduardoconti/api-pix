import { Logger, LoggerService } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { mockOutboxUserWebhookNotificationEntity } from '@domain/__mocks__';
import { ICronService, IQueue } from '@domain/core';
import { IOutboxRepository } from '@domain/core/repository';
import { AggregateTypeEnum } from '@domain/entities';

import { OutboxRepositoryMongo } from '@infra/database/mongo';
import { provideOutboxUserWebhookNotificationService } from '@infra/infra.provider';

import { OutboxUserWebhookNotificationService } from './outbox-user-webhook-notification.cron';

describe('OutboxUserWebhookNotificationService', () => {
  let logger: LoggerService;
  let outboxRepository: IOutboxRepository;
  let outboxWebhookService: ICronService;
  let queue: IQueue;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        provideOutboxUserWebhookNotificationService,
        {
          provide: Logger,
          useValue: {
            log: jest.fn(),
            error: jest.fn(),
          },
        },
        {
          provide: OutboxRepositoryMongo,
          useValue: {
            update: jest.fn(),
            findMany: jest.fn(),
          },
        },
        {
          provide: 'BullQueue_user_webhook_notification',
          useValue: {
            add: jest.fn(),
          },
        },
      ],
    }).compile();

    logger = app.get<LoggerService>(Logger);
    outboxRepository = app.get<IOutboxRepository>(OutboxRepositoryMongo);
    outboxWebhookService = app.get<ICronService>(
      OutboxUserWebhookNotificationService,
    );
    queue = app.get<IQueue>('BullQueue_user_webhook_notification');
  });

  it('should be defined', () => {
    expect(logger).toBeDefined();
    expect(outboxRepository).toBeDefined();
    expect(outboxWebhookService).toBeDefined();
    expect(queue).toBeDefined();
  });

  it('should handleCron successfully', async () => {
    jest
      .spyOn(outboxRepository, 'findMany')
      .mockResolvedValue([mockOutboxUserWebhookNotificationEntity]);

    jest.spyOn(queue, 'add').mockResolvedValue(undefined);
    jest
      .spyOn(outboxRepository, 'update')
      .mockResolvedValue(mockOutboxUserWebhookNotificationEntity);

    await outboxWebhookService.handleCron();
    expect(outboxRepository.findMany).toBeCalledWith({
      published: false,
      aggregateType: AggregateTypeEnum.USER_WEBHOOK_NOTIFICATION,
    });
    expect(outboxRepository.update).toBeCalledTimes(1);
    expect(queue.add).toBeCalledTimes(1);
  });

  it('should return if not find outbox', async () => {
    jest.spyOn(outboxRepository, 'findMany').mockResolvedValue([]);

    jest.spyOn(queue, 'add').mockResolvedValue(undefined);

    await outboxWebhookService.handleCron();
    expect(outboxRepository.findMany).toBeCalled();
    expect(outboxRepository.update).not.toBeCalled();
    expect(queue.add).not.toBeCalled();
  });

  it('should log error when error ocurred', async () => {
    jest
      .spyOn(outboxRepository, 'findMany')
      .mockResolvedValue([mockOutboxUserWebhookNotificationEntity]);

    jest.spyOn(queue, 'add').mockRejectedValue(new Error('any'));

    await outboxWebhookService.handleCron();
    expect(outboxRepository.findMany).toBeCalled();
    expect(queue.add).toBeCalled();
    expect(outboxRepository.update).not.toBeCalled();
    expect(logger.error).toBeCalledTimes(1);
  });
});
