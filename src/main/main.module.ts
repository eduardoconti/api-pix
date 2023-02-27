import { Module } from '@nestjs/common';

import { AppModule } from '@app/app.module';

import { InfraModule } from '@infra/infra.module';

import { PresentationModule } from '@presentation/presentation.module';

@Module({
  imports: [InfraModule, AppModule, PresentationModule],
})
export class MainModule {}
