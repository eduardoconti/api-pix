import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { ChargeCreatedDomainEvent } from '@domain/events';

@Injectable()
export class OrderCreatedListener {
  @OnEvent('ChargeCreatedDomainEvent', { async: true })
  LogChargeCreated(event: ChargeCreatedDomainEvent) {
    console.log(event);
  }
}
