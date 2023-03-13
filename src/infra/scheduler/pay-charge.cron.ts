import { LoggerService } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { IReceiveWebhookUseCase } from '@app/use-cases';

import { IChargeRepository, ICronService } from '@domain/core';
import { UUID } from '@domain/value-objects';

export class PayChargeService implements ICronService {
  constructor(
    private readonly logger: LoggerService,
    private readonly chargeRepository: IChargeRepository,
    private readonly webhookUseCase: IReceiveWebhookUseCase,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE, {
    disabled: process.env.NODE_ENV === 'production',
  })
  async handleCron() {
    this.logger.log('Called every minute', 'PayChargeService');

    const data = await this.chargeRepository.findMany({ status: 'ACTIVE' });
    if (data.length === 0) return;

    data.forEach(async (e) => {
      if (!e.props.providerId) return;
      try {
        await this.webhookUseCase.execute({
          amount: e.props.amount.value,
          endToEndId: `EE${UUID.generate()}`,
          provider: e.props.provider,
          providerId: e.props.providerId as string,
          type: 'CHARGE_PAYED',
          providerJson: JSON.stringify(e),
        });
      } catch (error) {
        this.logger.error(
          `failed to execute cron PayChargeService for charge ${e.id.value}`,
          error,
        );
      }
    });
  }
}
