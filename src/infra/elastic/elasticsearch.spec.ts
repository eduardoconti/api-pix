import { Logger, LoggerService } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { Test, TestingModule } from '@nestjs/testing';

import { ExternalLogs, SendExternalLogsProps } from '@domain/core/external-log';

import { ElasticSearch } from './elasticsearch';

describe('ElasticSearch', () => {
  let elasticSearch: ElasticSearch;
  let elasticsearchService: ElasticsearchService;
  let logger: LoggerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ElasticSearch,
        {
          provide: ElasticsearchService,
          useValue: {
            index: jest.fn(),
          },
        },
        {
          provide: Logger,
          useValue: {
            error: jest.fn(),
          },
        },
      ],
    }).compile();

    elasticSearch = module.get<ElasticSearch>(ElasticSearch);
    elasticsearchService =
      module.get<ElasticsearchService>(ElasticsearchService);
    logger = module.get<LoggerService>(Logger);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  type FakeData = {
    message: string;
  };
  const event: FakeData = { message: 'test' };
  const index = 'charge';
  const log: ExternalLogs<FakeData> = {
    createdAt: new Date(),
    service: 'fake',
    event,
  };
  const sendExternalLogsProps: SendExternalLogsProps<FakeData> = {
    index,
    body: log,
  };
  it('should be defined', () => {
    expect(logger).toBeDefined();
    expect(elasticSearch).toBeDefined();
    expect(elasticsearchService).toBeDefined();
  });

  it('should call the elasticsearchService index method with the correct arguments', async () => {
    jest.spyOn(elasticsearchService, 'index').mockImplementation();
    await elasticSearch.send<FakeData>(sendExternalLogsProps);

    expect(elasticsearchService.index).toHaveBeenCalledWith({
      index,
      body: log,
    });
    expect(logger.error).not.toBeCalled();
  });

  it('should log when elastic error', async () => {
    jest.spyOn(elasticsearchService, 'index').mockImplementation(() => {
      throw new Error('elastic error');
    });
    await expect(
      elasticSearch.send<FakeData>(sendExternalLogsProps),
    ).rejects.toThrow();

    expect(elasticsearchService.index).toHaveBeenCalledWith({
      index,
      body: log,
    });
    expect(logger.error).toBeCalled();
  });
});
