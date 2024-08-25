import { Module } from '@nestjs/common';

import { InfraModule } from '@infra/infra.module';

import {
  provideCelcoinImmediateChargeCreator,
  provideChargeCreatedListener,
  provideChargePayedListener,
  provideCreateImmediateChargeUseCase,
  provideCelcoinService,
  provideReceiveWebhookUseCase,
  provideRegisterUserUseCase,
  provideUserAuthUseCase,
} from './app.provider';
@Module({
  imports: [InfraModule],
  providers: [
    provideCelcoinService,
    provideCreateImmediateChargeUseCase,
    provideChargeCreatedListener,
    provideReceiveWebhookUseCase,
    provideRegisterUserUseCase,
    provideUserAuthUseCase,
    provideChargePayedListener,
    provideCelcoinImmediateChargeCreator,
  ],
  exports: [
    provideCelcoinService,
    provideCreateImmediateChargeUseCase,
    provideReceiveWebhookUseCase,
    provideRegisterUserUseCase,
    provideUserAuthUseCase,
    provideCelcoinImmediateChargeCreator,
  ],
})
export class AppModule {}
