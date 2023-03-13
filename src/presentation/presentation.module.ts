import { Module } from '@nestjs/common';

import { AppModule } from '@app/app.module';

import { CreateImmediateChargeController } from './controllers/create-charge';
import { HealthCheckController } from './controllers/health-check';
import { RegisterUserController } from './controllers/user';
import { ReceiveCelcoinWebhookController } from './controllers/webhook';

@Module({
  imports: [AppModule],
  controllers: [
    HealthCheckController,
    CreateImmediateChargeController,
    ReceiveCelcoinWebhookController,
    RegisterUserController,
  ],
})
export class PresentationModule {}
