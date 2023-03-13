import { Logger, LoggerService } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { IReceiveWebhookUseCase, ReceiveWebhookUseCase } from '@app/use-cases';

import { mockChargeEntityPayed } from '@domain/__mocks__';
import { IChargeRepository, ICronService } from '@domain/core';

import { providePayChargeService } from '@infra/infra.provider';
import { ChargeRepository } from '@infra/prisma';

import { PayChargeService } from './pay-charge.cron';

describe('PayChargeService', () => {
  let logger: LoggerService;
  let chargeRepository: IChargeRepository;
  let payChargeService: ICronService;
  let receiveWebhookUseCase: IReceiveWebhookUseCase;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        providePayChargeService,
        {
          provide: Logger,
          useValue: {
            log: jest.fn(),
            error: jest.fn(),
          },
        },
        {
          provide: ChargeRepository,
          useValue: {
            findMany: jest.fn(),
          },
        },
        {
          provide: ReceiveWebhookUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    logger = app.get<LoggerService>(Logger);
    chargeRepository = app.get<IChargeRepository>(ChargeRepository);
    payChargeService = app.get<ICronService>(PayChargeService);
    receiveWebhookUseCase = app.get<IReceiveWebhookUseCase>(
      ReceiveWebhookUseCase,
    );
  });

  it('should be defined', () => {
    expect(logger).toBeDefined();
    expect(chargeRepository).toBeDefined();
    expect(payChargeService).toBeDefined();
    expect(receiveWebhookUseCase).toBeDefined();
  });

  it('should handleCron successfully', async () => {
    jest
      .spyOn(chargeRepository, 'findMany')
      .mockResolvedValue([mockChargeEntityPayed]);

    await payChargeService.handleCron();
    expect(chargeRepository.findMany).toBeCalledWith({
      status: 'ACTIVE',
    });
    expect(receiveWebhookUseCase.execute).toBeCalledTimes(1);
  });

  it('should return if not find outbox', async () => {
    jest.spyOn(chargeRepository, 'findMany').mockResolvedValue([]);

    await payChargeService.handleCron();
    expect(chargeRepository.findMany).toBeCalled();
  });

  it('should log error when usecase failed', async () => {
    jest
      .spyOn(chargeRepository, 'findMany')
      .mockResolvedValue([mockChargeEntityPayed]);

    jest
      .spyOn(receiveWebhookUseCase, 'execute')
      .mockRejectedValue(new Error('any'));

    await payChargeService.handleCron();
    expect(chargeRepository.findMany).toBeCalledWith({
      status: 'ACTIVE',
    });
    expect(receiveWebhookUseCase.execute).toBeCalledTimes(1);
    expect(logger.error).toBeCalledTimes(1);
  });
});
