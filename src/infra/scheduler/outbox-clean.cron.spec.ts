import { Logger, LoggerService } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { ICronService } from '@domain/core';
import { IOutboxRepository } from '@domain/core/repository';

import { provideCleanOutboxService } from '@infra/infra.provider';
import { OutboxRepository } from '@infra/prisma';

import { CleanOutboxService } from './outbox-clean.cron';

describe('CleanOutboxService', () => {
  let logger: LoggerService;
  let outboxRepository: IOutboxRepository;
  let cleanOutboxService: ICronService;
  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        provideCleanOutboxService,
        {
          provide: Logger,
          useValue: {
            log: jest.fn(),
            error: jest.fn(),
          },
        },
        {
          provide: OutboxRepository,
          useValue: {
            sql: jest.fn(),
          },
        },
      ],
    }).compile();

    logger = app.get<LoggerService>(Logger);
    outboxRepository = app.get<IOutboxRepository>(OutboxRepository);
    cleanOutboxService = app.get<ICronService>(CleanOutboxService);
  });

  it('should be defined', () => {
    expect(logger).toBeDefined();
    expect(outboxRepository).toBeDefined();
    expect(cleanOutboxService).toBeDefined();
  });

  it('should handleCron successfully', async () => {
    jest.spyOn(outboxRepository, 'sql').mockResolvedValue(undefined);

    await cleanOutboxService.handleCron();
    expect(outboxRepository.sql).toBeCalledWith(
      `DELETE FROM outbox WHERE published = true AND created_at < NOW() - INTERVAL '5 minutes'`,
    );
  });

  it('should log error when sql failed', async () => {
    jest.spyOn(outboxRepository, 'sql').mockRejectedValue(new Error(''));

    await cleanOutboxService.handleCron();
    expect(outboxRepository.sql).toBeCalledWith(
      `DELETE FROM outbox WHERE published = true AND created_at < NOW() - INTERVAL '5 minutes'`,
    );
    expect(logger.error).toBeCalledTimes(1);
  });
});
