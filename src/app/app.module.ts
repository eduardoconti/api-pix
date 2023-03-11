import { Module } from '@nestjs/common';

import { InfraModule } from '@infra/infra.module';

import {
  provideChargeCreatedListener,
  provideCreateImmediateChargeUseCase,
  providePspService,
  provideReceiveWebhookUseCase,
} from './app.provider';
@Module({
  imports: [InfraModule],
  providers: [
    providePspService,
    provideCreateImmediateChargeUseCase,
    provideChargeCreatedListener,
    provideReceiveWebhookUseCase,
  ],
  exports: [
    providePspService,
    provideCreateImmediateChargeUseCase,
    provideReceiveWebhookUseCase,
  ],
})
export class AppModule {}
