import { Test, TestingModule } from '@nestjs/testing';

import { IExternalLog } from '@domain/core/external-log';
import { ChargeCreatedDomainEvent } from '@domain/events';

import { ElasticSearch } from '@infra/elastic';

import { ChargeCreatedListener } from './charge-created.event-handler';

describe('ChargeCreatedListener', () => {
  let chargeCreatedListener: ChargeCreatedListener;
  let elasticSearchService: IExternalLog;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChargeCreatedListener,
        {
          provide: ElasticSearch,
          useValue: {
            send: jest.fn(),
          },
        },
      ],
    }).compile();

    chargeCreatedListener = module.get<ChargeCreatedListener>(
      ChargeCreatedListener,
    );
    elasticSearchService = module.get<IExternalLog>(ElasticSearch);
  });

  it('should be defined', () => {
    expect(chargeCreatedListener).toBeDefined();
    expect(elasticSearchService).toBeDefined();
  });

  describe('LogChargeCreated', () => {
    it('should call the external log service with correct arguments', async () => {
      const event = new ChargeCreatedDomainEvent({
        aggregateId: 'asdf',
        amount: 200,
        emv: '',
        provider: 'CELCOIN',
        providerId: 'asdf',
        status: 'ACTIVE',
      });
      expect(
        await chargeCreatedListener.LogChargeCreated(event),
      ).toBeUndefined();
      const expectedLog = {
        index: 'charge',
        body: {
          event,
          service: 'ChargeCreatedDomainEvent',
          createdAt: expect.any(Date),
        },
      };
      expect(elasticSearchService.send).toBeCalledWith(expectedLog);
    });
  });
});
