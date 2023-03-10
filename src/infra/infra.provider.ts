import { Logger, LoggerService, Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { IReceiveWebhookUseCase, ReceiveWebhookUseCase } from '@app/use-cases';

import { IChargeRepository, IExternalLog, ILogger, IQueue } from '@domain/core';
import { IOutboxRepository } from '@domain/core/repository';

import { EnvironmentVariables } from '@main/config';

import { CacheManager } from './cache';
import { CelcoinApi } from './celcoin';
import { ElasticSearch } from './elastic';
import { HttpService, IHttpService } from './http-service';
import {
  ChargeRepository,
  OutboxRepository,
  PrismaService,
  UserRepository,
} from './prisma';
import { ElasticSearchConsumer, WebhookConsumer } from './processors';
import { CleanOutboxService, OutboxWebhookService } from './scheduler';
import { PayChargeService } from './scheduler/pay-charge.cron';

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

export const provideElasticSearchConsumer: Provider<ElasticSearchConsumer> = {
  provide: ElasticSearchConsumer,
  useFactory: (logger: ILogger, elastic: IExternalLog) => {
    return new ElasticSearchConsumer(elastic, logger);
  },
  inject: [Logger, ElasticSearch],
};

export const provideWebhookConsumer: Provider<WebhookConsumer> = {
  provide: WebhookConsumer,
  useFactory: (logger: ILogger, chargeRepository: IChargeRepository) => {
    return new WebhookConsumer(logger, chargeRepository);
  },
  inject: [Logger, ChargeRepository],
};

export const providePayChargeService: Provider<PayChargeService> = {
  provide: PayChargeService,
  useFactory: (
    logger: ILogger,
    chargeRepository: IChargeRepository,
    webhookUseCase: IReceiveWebhookUseCase,
  ) => {
    return new PayChargeService(logger, chargeRepository, webhookUseCase);
  },
  inject: [Logger, ChargeRepository, ReceiveWebhookUseCase],
};

export const provideUserRepository: Provider<UserRepository> = {
  provide: UserRepository,
  useFactory: (prismaService: PrismaService) => {
    return new UserRepository(prismaService);
  },
  inject: [PrismaService],
};
