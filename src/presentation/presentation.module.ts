import { Module } from '@nestjs/common';

import { AppModule } from '@app/app.module';

import { InfraModule } from '@infra/infra.module';

import { AuthController } from './controllers/auth/auth.controller';
import { CreateImmediateChargeController } from './controllers/create-charge';
import { HealthCheckController } from './controllers/health-check';
import { RegisterUserController } from './controllers/user';
import { ReceiveCelcoinWebhookController } from './controllers/webhook';

@Module({
  imports: [AppModule, InfraModule],
  controllers: [
    HealthCheckController,
    CreateImmediateChargeController,
    ReceiveCelcoinWebhookController,
    RegisterUserController,
    AuthController,
  ],
})
export class PresentationModule {}
