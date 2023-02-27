import { HttpService as Axios } from '@nestjs/axios';
import { Logger, LoggerService } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { HttpService, IHttpService } from './http-service';

class MockHttpService {
  post() {
    // Implement your mock post method here
  }
  axiosRef = {
    post: jest.fn(),
  };
}

describe('HttpService', () => {
  let httpService: IHttpService;
  let mockLogger: LoggerService;
  let axiosService: any;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: Logger,
          useValue: {
            log: jest.fn(),
          },
        },
        HttpService,
        {
          provide: Axios,
          useClass: MockHttpService,
        },
      ],
    }).compile();

    httpService = app.get<IHttpService>(HttpService);
    mockLogger = app.get<LoggerService>(Logger);
    axiosService = app.get(Axios);
  });

  it('should be defined', () => {
    expect(httpService).toBeDefined();
    expect(mockLogger).toBeDefined();
    expect(axiosService).toBeDefined();
  });
  it('should execute post successfully', async () => {
    const mockResponseData = {
      any: 'any',
    };

    const props = {
      url: 'http://example.com',
      body: { foo: 'bar' },
      headers: { Authorization: 'Bearer token' },
    };

    const mockPost = jest
      .fn()
      .mockResolvedValueOnce({ data: mockResponseData });
    axiosService.axiosRef.post.mockImplementation(mockPost);

    const result = await httpService.post(props);

    expect(result).toEqual(mockResponseData);

    expect(mockPost).toHaveBeenCalledWith(
      'http://example.com',
      { foo: 'bar' },
      { headers: { Authorization: 'Bearer token' } },
    );

    expect(mockLogger.log).toHaveBeenCalledWith(
      JSON.stringify(props),
      'EXTERNAL API REQUEST',
    );

    expect(mockLogger.log).toHaveBeenCalledWith(
      JSON.stringify(mockResponseData),
      'EXTERNAL API RESPONSE',
    );

    expect(mockLogger.log).toHaveBeenCalledWith(
      '{"url":"http://example.com","requestTime":0}',
      'EXTERNAL API REQUEST',
    );
  });
});
