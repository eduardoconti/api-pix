import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { HealthCheckController } from '@presentation/controllers';

import { configValidationSchema } from './config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      validationSchema: configValidationSchema,
    }),
  ],
  controllers: [HealthCheckController],
})
export class AppModule {}
