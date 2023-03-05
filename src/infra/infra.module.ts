import { HttpModule } from '@nestjs/axios';
import { CacheModule, Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';
import type { ClientOpts } from 'redis';

import { configValidationSchema, EnvironmentVariables } from '@main/config';

import { CacheManager } from './cache/cache-manager';
import { CelcoinApi } from './celcoin';
import { HttpService } from './http-service/http-service';
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
  ],
  providers: [CelcoinApi, HttpService, Logger, CacheManager],
  exports: [CelcoinApi, HttpService, CacheManager],
})
export class InfraModule {}
