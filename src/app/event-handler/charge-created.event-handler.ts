import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Queue } from 'bull';

import { SendExternalLogsProps } from '@domain/core/external-log';
import { ChargeCreatedDomainEvent } from '@domain/events';

@Injectable()
export class ChargeCreatedListener {
  constructor(@InjectQueue('elasticsearch') private queue: Queue) {}
  @OnEvent('ChargeCreatedDomainEvent', { async: true })
  async logChargeCreated(event: ChargeCreatedDomainEvent) {
    const log: SendExternalLogsProps<ChargeCreatedDomainEvent> = {
      index: 'charge',
      body: {
        event,
        service: 'ChargeCreatedDomainEvent',
        createdAt: new Date(),
      },
    };

    await this.queue.add(log);
  }
}
