import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { IExternalLog } from '@domain/core/external-log';
import { ChargeCreatedDomainEvent } from '@domain/events';

import { ElasticSearch } from '@infra/elastic';

@Injectable()
export class ChargeCreatedListener {
  constructor(
    @Inject(ElasticSearch)
    private readonly elasticsearchService: IExternalLog,
  ) {}
  @OnEvent('ChargeCreatedDomainEvent', { async: true })
  async LogChargeCreated(event: ChargeCreatedDomainEvent) {
    await this.elasticsearchService.send<ChargeCreatedDomainEvent>({
      index: 'charge',
      body: {
        event,
        service: 'ChargeCreatedDomainEvent',
        createdAt: new Date(),
      },
    });
  }
}
