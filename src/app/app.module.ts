import { Module } from '@nestjs/common';

import { InfraModule } from '@infra/infra.module';

import { PspService } from './services';
import { CreateImmediateChargeUseCase } from './use-cases';

@Module({
  imports: [InfraModule],
  providers: [PspService, CreateImmediateChargeUseCase],
  exports: [PspService, CreateImmediateChargeUseCase],
})
export class AppModule {}
