import { Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Test, TestingModule } from '@nestjs/testing';
import { Job } from 'bull';

import {
  mockPendingChargeEntity,
  mockChargeEntityExpired,
  mockChargeEntityPayed,
  mockWebhookEntity,
} from '@domain/__mocks__';
import { IChargeRepository, IEventEmitter, ILogger } from '@domain/core';
import { ArgumentInvalidException } from '@domain/exceptions';

import { provideWebhookConsumer } from '@infra/infra.provider';
import { ChargeRepository } from '@infra/prisma';
import { WebhookModel } from '@infra/prisma/models';

import { WebhookConsumer } from './webhook.processor';

const fakeJob = {
  data: WebhookModel.fromEntity(mockWebhookEntity),
  queue: 'webhook',
  id: 'fakeid',
  remove: jest.fn(),
} as unknown as Job<WebhookModel>;
describe('WebhookConsumer', () => {
  let webhookConsumer: WebhookConsumer;
  let chargeRepository: IChargeRepository;
  let eventEmitter: IEventEmitter;
  let logger: ILogger;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        provideWebhookConsumer,
        {
          provide: ChargeRepository,
          useValue: {
            findOne: jest.fn(),
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
          provide: EventEmitter2,
          useValue: {
            emitAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    webhookConsumer = app.get<WebhookConsumer>(WebhookConsumer);
    chargeRepository = app.get<IChargeRepository>(ChargeRepository);
    logger = app.get<ILogger>(Logger);
    eventEmitter = app.get<IEventEmitter>(EventEmitter2);
  });

  describe('WebhookConsumer', () => {
    it('should be defined', () => {
      expect(webhookConsumer).toBeDefined();
      expect(chargeRepository).toBeDefined();
      expect(logger).toBeDefined();
      expect(eventEmitter).toBeDefined();
    });
    it('should throw error if amount does not match', async () => {
      const { data, ...rest } = fakeJob;
      jest
        .spyOn(chargeRepository, 'findOne')
        .mockResolvedValue(mockPendingChargeEntity);
      await expect(
        webhookConsumer.process({
          ...rest,
          data: {
            ...data,
            amount: 8001,
          },
        }),
      ).rejects.toThrow();
      expect(chargeRepository.findOne).toBeCalled();
      expect(chargeRepository.update).not.toBeCalled();
    });
    it('should process successfully if webhook type is CHARGE_PAYED', async () => {
      jest
        .spyOn(chargeRepository, 'findOne')
        .mockResolvedValue(mockPendingChargeEntity);

      jest
        .spyOn(chargeRepository, 'update')
        .mockResolvedValue(mockPendingChargeEntity);

      jest.spyOn(eventEmitter, 'emitAsync').mockResolvedValue(undefined);

      await webhookConsumer.process(fakeJob);
      expect(chargeRepository.findOne).toBeCalled();
      expect(chargeRepository.update).toBeCalled();
      expect(eventEmitter.emitAsync).toBeCalled();
    });

    it('should not update if webhook type is not CHARGE_PAYED', async () => {
      const { data, ...rest } = fakeJob;
      jest
        .spyOn(chargeRepository, 'findOne')
        .mockResolvedValue(mockPendingChargeEntity);

      await webhookConsumer.process({
        ...rest,
        data: {
          ...data,
          type: 'CHARGE_REFUNDED',
        },
      });
      expect(chargeRepository.findOne).toBeCalled();
      expect(chargeRepository.update).not.toBeCalled();
      expect(eventEmitter.emitAsync).not.toBeCalled();
    });

    it('should throw error if charge already payed', async () => {
      jest
        .spyOn(chargeRepository, 'findOne')
        .mockResolvedValue(mockChargeEntityPayed);
      await expect(webhookConsumer.process(fakeJob)).rejects.toThrow();
      expect(chargeRepository.findOne).toBeCalled();
      expect(chargeRepository.update).not.toBeCalled();
      expect(eventEmitter.emitAsync).not.toBeCalled();
    });

    it('should throw error if charge is expired', async () => {
      jest
        .spyOn(chargeRepository, 'findOne')
        .mockResolvedValue(mockChargeEntityExpired);
      await expect(webhookConsumer.process(fakeJob)).rejects.toThrow();
      expect(chargeRepository.findOne).toBeCalled();
      expect(chargeRepository.update).not.toBeCalled();
      expect(eventEmitter.emitAsync).not.toBeCalled();
    });

    it('logger onQueueFailed', () => {
      webhookConsumer.onQueueFailed(fakeJob, new Error('any'));
      expect(logger.error).toBeCalled();
      expect(fakeJob.remove).not.toBeCalled();
    });

    it('remove job in onQueueFailed if error is istanceof ArgumentInvalidException ', () => {
      webhookConsumer.onQueueFailed(
        fakeJob,
        new ArgumentInvalidException('any'),
      );
      expect(logger.error).toBeCalled();
      expect(fakeJob.remove).toBeCalled();
    });

    it('logger onQueueActive', () => {
      webhookConsumer.onActive(fakeJob);
      expect(logger.log).toBeCalled();
    });
  });
});
