import { Module } from '@nestjs/common';

import { AppModule } from '@app/app.module';

import { CreateImmediateChargeController } from './controllers/create-charge';
import { HealthCheckController } from './controllers/health-check';
import { ReceiveCelcoinWebhookController } from './controllers/webhook';

@Module({
  imports: [AppModule],
  controllers: [
    HealthCheckController,
    CreateImmediateChargeController,
    ReceiveCelcoinWebhookController,
  ],
})
export class PresentationModule {}
