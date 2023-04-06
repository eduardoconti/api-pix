import { HttpModule } from '@nestjs/axios';
import { BullModule } from '@nestjs/bull';
import { CacheModule, forwardRef, Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { ScheduleModule } from '@nestjs/schedule';
import { SentryInterceptor, SentryModule } from '@ntegral/nestjs-sentry';
import { PrismaClient } from '@prisma/client';
import * as Sentry from '@sentry/node';
import { ProfilingIntegration } from '@sentry/profiling-node';
import * as Tracing from '@sentry/tracing';
import * as redisStore from 'cache-manager-redis-store';
import type { ClientOpts } from 'redis';

import { AppModule } from '@app/app.module';

import { BaseException } from '@domain/exceptions';

import { UserModel, UserSchema } from '@infra/database/models';
import { UserRepositoryMongo } from '@infra/database/mongo';

import { configValidationSchema, EnvironmentVariables } from '@main/config';

import { CacheManager } from './cache';
import {
  WebhookRepository,
  ChargeRepository,
  OutboxRepository,
} from './database/prisma';
import { PrismaService } from './database/prisma';
import { ElasticSearch } from './elastic';
import { HttpService } from './http-service';
import {
  provideCelcoinApi,
  provideCleanOutboxService,
  provideElasticSearchConsumer,
  provideOutboxUserWebhookNotificationService,
  provideOutboxWebhookService,
  providePayChargeService,
  provideUserRepository,
  provideUserWebhookNotificationConsumer,
  provideUserWebhookNotificationRepository,
  provideWebhookConsumer,
} from './infra.provider';
import { SentryMonitorError } from './sentry';
import { JwtStrategy } from './strategy/auth';
import { LocalStrategy } from './strategy/auth/local.strategy';
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
        host: config.getOrThrow('REDIS_HOST'),
        port: config.getOrThrow('REDIS_PORT'),
        password: config.getOrThrow('REDIS_PASSWORD'),
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
        node: config.get('ELASTIC_HOST'),
        name: 'elastic',
        maxRetries: 5,
        requestTimeout: 500,
      }),
      inject: [ConfigService],
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule.forRoot()],
      useFactory: async (
        configService: ConfigService<EnvironmentVariables>,
      ) => ({
        redis: {
          host: configService.getOrThrow('REDIS_HOST'),
          port: configService.getOrThrow('REDIS_PORT'),
          password: configService.getOrThrow('REDIS_PASSWORD'),
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
    BullModule.registerQueue({
      name: `user_webhook_notification`,
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
    SentryModule.forRootAsync({
      inject: [ConfigService],
      imports: [],
      useFactory: async (
        configService: ConfigService<EnvironmentVariables>,
      ) => ({
        dsn: configService.get('SENTRY_DSN'),
        debug: true,
        tracesSampleRate: 1.0,
        profilesSampleRate: 1.0,
        attachStacktrace: true,
        environment: configService.get('NODE_ENV'),
        integrations: [
          new Sentry.Integrations.Http({ tracing: true }),
          new Tracing.Integrations.Express(),
          new ProfilingIntegration(),
          new Tracing.Integrations.Prisma({ client: new PrismaClient() }),
        ],
        logLevels: ['debug'],
        beforeSend(event, hint) {
          const exception = hint?.originalException;
          if (exception instanceof BaseException) {
            event.extra = {
              message: exception.message,
              metadata: exception?.metadata,
            };
          }

          return event;
        },
      }),
    }),
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (
        configService: ConfigService<EnvironmentVariables>,
      ) => ({
        secret: configService.getOrThrow('JWT_KEY'),
        signOptions: { expiresIn: '1d' },
      }),
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<EnvironmentVariables>) => ({
        uri: configService.get('DB_MONGO_URI'),
        dbName: configService.get('DB_NAME'),
      }),
    }),
    MongooseModule.forFeature([{ name: UserModel.name, schema: UserSchema }]),
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
    SentryMonitorError,
    UserRepositoryMongo,
    {
      provide: APP_INTERCEPTOR,
      useFactory: () => new SentryInterceptor(),
    },
    LocalStrategy,
    JwtStrategy,
    provideUserWebhookNotificationRepository,
    provideOutboxUserWebhookNotificationService,
    provideUserWebhookNotificationConsumer,
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
    SentryMonitorError,
    JwtModule,
    provideUserWebhookNotificationRepository,
    UserRepositoryMongo,
  ],
})
export class InfraModule {}
