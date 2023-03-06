import { Test, TestingModule } from '@nestjs/testing';
import { Queue } from 'bull';

import { mockChargeCreatedDomainEvent } from '@domain/__mocks__';

import { ChargeCreatedListener } from './charge-created.event-handler';

describe('ChargeCreatedListener', () => {
  let listener: ChargeCreatedListener;
  let queue: Queue;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChargeCreatedListener,
        {
          provide: 'BullQueue_elasticsearch',
          useValue: {
            add: jest.fn(),
          },
        },
      ],
    }).compile();

    listener = module.get<ChargeCreatedListener>(ChargeCreatedListener);
    queue = module.get<Queue>('BullQueue_elasticsearch');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should add log to elasticsearch queue', async () => {
    const addSpy = jest.spyOn(queue, 'add');

    await listener.logChargeCreated(mockChargeCreatedDomainEvent);

    expect(addSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        index: 'charge',
        body: {
          event: mockChargeCreatedDomainEvent,
          service: 'ChargeCreatedDomainEvent',
          createdAt: expect.any(Date),
        },
      }),
    );
  });
});
