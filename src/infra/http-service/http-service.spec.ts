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

const props = {
  url: 'http://example.com',
  body: { foo: 'bar' },
  headers: { Authorization: 'Bearer token' },
};

const mockResponseData = {
  any: 'any',
};

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
            error: jest.fn(),
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
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(httpService).toBeDefined();
    expect(mockLogger).toBeDefined();
    expect(axiosService).toBeDefined();
  });
  it('should execute post successfully', async () => {
    const mockPost = jest
      .fn()
      .mockResolvedValueOnce({ data: mockResponseData });
    axiosService.axiosRef.post.mockImplementation(mockPost);

    const result = await httpService.post(props);

    expect(result).toEqual(mockResponseData);

    expect(mockPost).toHaveBeenCalledWith(
      'http://example.com',
      { foo: 'bar' },
      { headers: { Authorization: 'Bearer token' }, timeout: 5000 },
    );

    expect(mockLogger.log).toBeCalledTimes(3);
  });

  it('should execute post without body successfully', async () => {
    const mockPost = jest
      .fn()
      .mockResolvedValueOnce({ data: mockResponseData });
    axiosService.axiosRef.post.mockImplementation(mockPost);

    const result = await httpService.post({
      url: 'http://example.com',
      headers: { Authorization: 'Bearer token' },
    });

    expect(result).toEqual(mockResponseData);

    expect(mockPost).toHaveBeenCalledWith('http://example.com', undefined, {
      headers: { Authorization: 'Bearer token' },
      timeout: 5000,
    });

    expect(mockLogger.log).toBeCalledTimes(3);
  });

  it('should throw error', async () => {
    const mockError = new Error('any');
    const mockPost = jest.fn().mockRejectedValueOnce(mockError);
    axiosService.axiosRef.post.mockImplementation(mockPost);

    await expect(
      httpService.post({ ...props, body: undefined }),
    ).rejects.toThrow();
    expect(mockLogger.log).toBeCalled();
    expect(mockLogger.error).toBeCalledTimes(1);
  });
});
