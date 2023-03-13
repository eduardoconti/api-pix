import { Module } from '@nestjs/common';

import { InfraModule } from '@infra/infra.module';

import {
  provideChargeCreatedListener,
  provideCreateImmediateChargeUseCase,
  providePspService,
  provideReceiveWebhookUseCase,
  provideRegisterUserUseCase,
} from './app.provider';
@Module({
  imports: [InfraModule],
  providers: [
    providePspService,
    provideCreateImmediateChargeUseCase,
    provideChargeCreatedListener,
    provideReceiveWebhookUseCase,
    provideRegisterUserUseCase,
  ],
  exports: [
    providePspService,
    provideCreateImmediateChargeUseCase,
    provideReceiveWebhookUseCase,
    provideRegisterUserUseCase,
  ],
})
export class AppModule {}
