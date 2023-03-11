import { Logger, LoggerService, Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { IQueue } from '@domain/core';
import { IOutboxRepository } from '@domain/core/repository';

import { EnvironmentVariables } from '@main/config';

import { CacheManager } from './cache';
import { CelcoinApi } from './celcoin';
import { HttpService, IHttpService } from './http-service';
import { OutboxRepository } from './prisma';
import { CleanOutboxService, OutboxWebhookService } from './scheduler';

export const provideCelcoinApi: Provider<CelcoinApi> = {
  provide: CelcoinApi,
  useFactory: (
    httpService: IHttpService,
    configService: ConfigService<EnvironmentVariables>,
    cacheManager: CacheManager,
  ) => {
    return new CelcoinApi(httpService, configService, cacheManager);
  },
  inject: [HttpService, ConfigService, CacheManager],
};

export const provideOutboxWebhookService: Provider<OutboxWebhookService> = {
  provide: OutboxWebhookService,
  useFactory: (
    logger: LoggerService,
    outboxRepository: IOutboxRepository,
    queue: IQueue,
  ) => {
    return new OutboxWebhookService(logger, outboxRepository, queue);
  },
  inject: [Logger, OutboxRepository, 'BullQueue_webhook'],
};

export const provideCleanOutboxService: Provider<CleanOutboxService> = {
  provide: CleanOutboxService,
  useFactory: (logger: LoggerService, outboxRepository: IOutboxRepository) => {
    return new CleanOutboxService(logger, outboxRepository);
  },
  inject: [Logger, OutboxRepository],
};
