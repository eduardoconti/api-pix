import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Job } from 'bull';

import { IExternalLog, ILogger } from '@domain/core';

import { ElasticSearch } from '@infra/elastic';
import { provideElasticSearchConsumer } from '@infra/infra.provider';

import { ElasticSearchConsumer } from './elasticsearch.processor';

const fakeJob = {
  data: {
    fake: 'fake',
  },
  queue: 'elastic',
  id: 'fakeid',
} as unknown as Job<any>;
describe('ElasticSearchConsumer', () => {
  let elasticSearchConsumer: ElasticSearchConsumer;
  let elasticService: IExternalLog;
  let logger: ILogger;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        provideElasticSearchConsumer,
        {
          provide: ElasticSearch,
          useValue: {
            send: jest.fn(),
          },
        },
        {
          provide: Logger,
          useValue: {
            log: jest.fn(),
            error: jest.fn(),
          },
        },
      ],
    }).compile();

    elasticSearchConsumer = app.get<ElasticSearchConsumer>(
      ElasticSearchConsumer,
    );
    elasticService = app.get<IExternalLog>(ElasticSearch);
    logger = app.get<ILogger>(Logger);
  });

  describe('ElasticSearchConsumer', () => {
    it('should be defined', () => {
      expect(elasticSearchConsumer).toBeDefined();
      expect(elasticService).toBeDefined();
      expect(logger).toBeDefined();
    });

    it('should process successfully', async () => {
      jest.spyOn(elasticService, 'send').mockResolvedValue();
      await elasticSearchConsumer.process(fakeJob);
      expect(elasticService.send).toBeCalled();
    });

    it('logger onQueueFailed', () => {
      elasticSearchConsumer.onQueueFailed(fakeJob, new Error('any'));
      expect(logger.error).toBeCalled();
    });

    it('logger onQueueActive', () => {
      elasticSearchConsumer.onActive(fakeJob);
      expect(logger.log).toBeCalled();
    });
  });
});
