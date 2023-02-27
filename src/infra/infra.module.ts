import { HttpModule } from '@nestjs/axios';
import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { configValidationSchema } from '@main/config';

import { CelcoinApi } from './celcoin';
import { HttpService } from './http-service/http-service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      validationSchema: configValidationSchema,
      isGlobal: true,
    }),
    HttpModule,
  ],
  providers: [CelcoinApi, HttpService, Logger],
  exports: [CelcoinApi, HttpService],
})
export class InfraModule {}
