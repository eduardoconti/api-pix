import { Module } from '@nestjs/common';

import { InfraModule } from '@infra/infra.module';

import {
  provideChargeCreatedListener,
  provideCreateImmediateChargeUseCase,
  providePspService,
  provideReceiveWebhookUseCase,
  provideRegisterUserUseCase,
  provideUserAuthUseCase,
} from './app.provider';
@Module({
  imports: [InfraModule],
  providers: [
    providePspService,
    provideCreateImmediateChargeUseCase,
    provideChargeCreatedListener,
    provideReceiveWebhookUseCase,
    provideRegisterUserUseCase,
    provideUserAuthUseCase,
  ],
  exports: [
    providePspService,
    provideCreateImmediateChargeUseCase,
    provideReceiveWebhookUseCase,
    provideRegisterUserUseCase,
    provideUserAuthUseCase,
  ],
})
export class AppModule {}
