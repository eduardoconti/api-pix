import { Cron } from '@nestjs/schedule';

import { OutboxService } from '@app/services';

import { ICronService } from '@domain/core';
import { AggregateTypeEnum } from '@domain/entities';

export class OutboxUserWebhookNotificationService
  extends OutboxService
  implements ICronService
{
  protected aggregateType: AggregateTypeEnum =
    AggregateTypeEnum.USER_WEBHOOK_NOTIFICATION;

  @Cron('*/2 * * * * *')
  async handleCron() {
    this.logger.log('Called every 2 seconds', this.aggregateType);

    await this.execute();
  }
}
