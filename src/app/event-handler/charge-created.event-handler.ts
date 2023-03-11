import { OnEvent } from '@nestjs/event-emitter';

import { IQueue, SendExternalLogsProps } from '@domain/core';
import { ChargeCreatedDomainEvent } from '@domain/events';
export class ChargeCreatedListener {
  constructor(
    private queue: IQueue<SendExternalLogsProps<ChargeCreatedDomainEvent>>,
  ) {}
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
