import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { HttpModule } from '@nestjs/axios';
import { BullModule } from '@nestjs/bull';
import { CacheModule, forwardRef, Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { GraphQLModule } from '@nestjs/graphql';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { ScheduleModule } from '@nestjs/schedule';
//import { PrismaClient } from '@prisma/client';
import * as redisStore from 'cache-manager-redis-store';
import { DirectiveLocation, GraphQLDirective } from 'graphql';
import GraphQLJSON from 'graphql-type-json';
import type { ClientOpts } from 'redis';

import { AppModule } from '@app/app.module';

import {
  ChargeModel,
  ChargeSchema,
  OutBoxModel,
  OutboxSchema,
  UserModel,
  UserSchema,
  UserWebhookNotificationModel,
  UserWebhookNotificationSchema,
  WebhookModel,
  WebhookSchema,
} from '@infra/database/models';
import {
  ChargeRepositoryMongo,
  OutboxRepositoryMongo,
  UserRepositoryMongo,
  WebhookRepositoryMongo,
} from '@infra/database/mongo';
import { UserWebhookNotificationRepositoryMongo } from '@infra/database/mongo';
import { upperDirectiveTransformer } from '@infra/graphql/upper-case.directive';

import { configValidationSchema, EnvironmentVariables } from '@main/config';

import { CacheManager } from './cache';
//import { PrismaService } from './database/prisma';
import { ElasticSearch } from './elastic';
import { HttpService } from './http-service';
import {
  provideCelcoinApi,
  provideCleanOutboxService,
  provideElasticSearchConsumer,
  provideOutboxUserWebhookNotificationService,
  provideOutboxWebhookService,
  providePayChargeService,
  //provideUserRepository,
  provideUserWebhookNotificationConsumer,
  // provideUserWebhookNotificationRepository,
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
        attempts: 3,
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
        attempts: 3,
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
        attempts: 3,
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
    MongooseModule.forFeature([
      { name: ChargeModel.name, schema: ChargeSchema },
    ]),
    MongooseModule.forFeature([
      { name: OutBoxModel.name, schema: OutboxSchema },
    ]),
    MongooseModule.forFeature([
      { name: WebhookModel.name, schema: WebhookSchema },
    ]),
    MongooseModule.forFeature([
      {
        name: UserWebhookNotificationModel.name,
        schema: UserWebhookNotificationSchema,
      },
    ]),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'schema.gql',
      transformSchema: (schema) => upperDirectiveTransformer(schema, 'upper'),
      installSubscriptionHandlers: true,
      resolvers: { JSON: GraphQLJSON },
      formatError: (e: any) => {
        return { message: e.message };
      },
      buildSchemaOptions: {
        directives: [
          new GraphQLDirective({
            name: 'upper',
            locations: [DirectiveLocation.FIELD_DEFINITION],
          }),
        ],
      },
    }),
  ],
  providers: [
    HttpService,
    Logger,
    CacheManager,
    ElasticSearch,
    //PrismaService,
    ChargeRepositoryMongo,
    WebhookRepositoryMongo,
    provideCelcoinApi,
    OutboxRepositoryMongo,
    provideWebhookConsumer,
    provideElasticSearchConsumer,
    provideOutboxWebhookService,
    provideCleanOutboxService,
    providePayChargeService,
    //provideUserRepository,
    SentryMonitorError,
    UserRepositoryMongo,
    LocalStrategy,
    JwtStrategy,
    // provideUserWebhookNotificationRepository,
    provideOutboxUserWebhookNotificationService,
    provideUserWebhookNotificationConsumer,
    UserWebhookNotificationRepositoryMongo,
  ],
  exports: [
    HttpService,
    CacheManager,
    Logger,
    ElasticSearch,
    //PrismaService,
    ChargeRepositoryMongo,
    BullModule,
    WebhookRepositoryMongo,
    OutboxRepositoryMongo,
    provideCelcoinApi,
    //provideUserRepository,
    SentryMonitorError,
    JwtModule,
    // provideUserWebhookNotificationRepository,
    UserRepositoryMongo,
    UserWebhookNotificationRepositoryMongo,
  ],
})
export class InfraModule {}
