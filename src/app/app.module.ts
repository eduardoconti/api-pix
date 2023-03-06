import { Module } from '@nestjs/common';

import { InfraModule } from '@infra/infra.module';

import { ChargeCreatedListener } from './event-handler/charge-created.event-handler';
import { PspService } from './services';
import { CreateImmediateChargeUseCase } from './use-cases';

@Module({
  imports: [InfraModule],
  providers: [PspService, CreateImmediateChargeUseCase, ChargeCreatedListener],
  exports: [PspService, CreateImmediateChargeUseCase],
})
export class AppModule {}
