import { Module } from '@nestjs/common';

import { AppModule } from '@app/app.module';

import { CreateImmediateChargeController } from './controllers/create-charge';
import { HealthCheckController } from './controllers/health-check';

@Module({
  imports: [AppModule],
  controllers: [HealthCheckController, CreateImmediateChargeController],
})
export class PresentationModule {}
