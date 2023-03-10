import { HttpModule } from '@nestjs/axios';
import { BullModule } from '@nestjs/bull';
import { CacheModule, forwardRef, Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import * as redisStore from 'cache-manager-redis-store';
import type { ClientOpts } from 'redis';

import { AppModule } from '@app/app.module';

import { configValidationSchema, EnvironmentVariables } from '@main/config';

import { CacheManager } from './cache';
import { ElasticSearch } from './elastic';
import { HttpService } from './http-service';
import {
  provideCelcoinApi,
  provideCleanOutboxService,
  provideElasticSearchConsumer,
  provideOutboxWebhookService,
  providePayChargeService,
  provideUserRepository,
  provideWebhookConsumer,
} from './infra.provider';
import {
  WebhookRepository,
  ChargeRepository,
  OutboxRepository,
} from './prisma';
import { PrismaService } from './prisma';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      validationSchema: configValidationSchema,
      isGlobal: true,
    }),
    CacheModule.registerAsync<ClientOpts>({
      imports: [ConfigModule, HttpModule],
      useFactory: async (config: ConfigService<EnvironmentVariables>) => ({
        ttl: 3600,
        store: redisStore,
        host: config.get('REDIS_HOST'),
        port: config.get('REDIS_PORT'),
        isGlobal: true,
      }),
      inject: [ConfigService],
    }),
    HttpModule,
    EventEmitterModule.forRoot({
      // set this to `true` to use wildcards
      wildcard: false,
      // the delimiter used to segment namespaces
      delimiter: '.',
      // set this to `true` if you want to emit the newListener event
      newListener: false,
      // set this to `true` if you want to emit the removeListener event
      removeListener: false,
      // the maximum amount of listeners that can be assigned to an event
      maxListeners: 10,
      // show event name in memory leak message when more than maximum amount of listeners is assigned
      verboseMemoryLeak: false,
      // disable throwing uncaughtException if an error event is emitted and it has no listeners
      ignoreErrors: false,
    }),
    ElasticsearchModule.registerAsync({
      useFactory: async (config: ConfigService<EnvironmentVariables>) => ({
        node: config.getOrThrow('ELASTIC_HOST'),
        name: 'elastic',
        maxRetries: 5,
      }),
      inject: [ConfigService],
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule.forRoot()],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get('REDIS_HOST'),
          port: configService.get('REDIS_PORT'),
        },
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueue({
      name: `elasticsearch`,
      defaultJobOptions: {
        attempts: 10,
        removeOnComplete: true,
        removeOnFail: false,
        backoff: {
          type: 'exponential',
          delay: 1000,
        },
      },
    }),
    BullModule.registerQueue({
      name: `webhook`,
      defaultJobOptions: {
        attempts: 10,
        removeOnComplete: true,
        removeOnFail: false,
        backoff: {
          type: 'exponential',
          delay: 1000,
        },
      },
    }),
    ScheduleModule.forRoot(),
    forwardRef(() => AppModule),
  ],
  providers: [
    HttpService,
    Logger,
    CacheManager,
    ElasticSearch,
    PrismaService,
    ChargeRepository,
    WebhookRepository,
    provideCelcoinApi,
    OutboxRepository,
    provideWebhookConsumer,
    provideElasticSearchConsumer,
    provideOutboxWebhookService,
    provideCleanOutboxService,
    providePayChargeService,
    provideUserRepository,
  ],
  exports: [
    HttpService,
    CacheManager,
    Logger,
    ElasticSearch,
    PrismaService,
    ChargeRepository,
    BullModule,
    WebhookRepository,
    OutboxRepository,
    provideCelcoinApi,
    provideUserRepository,
  ],
})
export class InfraModule {}
