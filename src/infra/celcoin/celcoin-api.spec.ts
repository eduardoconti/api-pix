import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { ICacheManager } from '@domain/core';

import {
  mockCelcoinAuth,
  mockCelcoinAuthResponse,
  mockCelcoinErrorResponse,
  mockCelcoinImmediateChargeRequest,
  mockCelcoinImmediateChargeResponse,
  mockCelcoinLocationResponse,
  mockCreateLocationOnCelcoinRequest,
} from '@infra/__mocks__/celcoin.mock';
import { CacheManager } from '@infra/cache';
import {
  CreateImmediateChargeException,
  PspAuthenticationException,
} from '@infra/exceptions';
import { HttpService, IHttpService } from '@infra/http-service';
import { InfraModule } from '@infra/infra.module';

import { CelcoinApi } from './celcoin-api';

describe('CelcoinApi', () => {
  let celcoinApi: CelcoinApi;
  let httpService: IHttpService;
  let cacheManager: ICacheManager;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [InfraModule],
      providers: [
        CelcoinApi,
        ConfigService,
        {
          provide: HttpService,
          useValue: {
            post: jest.fn(),
          },
        },
        {
          provide: CacheManager,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
          },
        },
      ],
    }).compile();

    celcoinApi = app.get<CelcoinApi>(CelcoinApi);
    httpService = app.get<IHttpService>(HttpService);
    cacheManager = app.get<ICacheManager>(CacheManager);
  });

  it('should be defined', () => {
    expect(celcoinApi).toBeDefined();
    expect(httpService).toBeDefined();
    expect(cacheManager).toBeDefined();
  });

  describe('authenticate', () => {
    it('should authenticate successfully and set cache', async () => {
      jest
        .spyOn(httpService, 'post')
        .mockResolvedValue(mockCelcoinAuthResponse);
      jest.spyOn(cacheManager, 'get').mockResolvedValue(undefined);
      jest.spyOn(cacheManager, 'set').mockResolvedValue();
      const result = await celcoinApi.auth();
      expect(result).toBeDefined();
      expect(httpService.post).toBeCalled();
      expect(cacheManager.get).toBeCalled();
      expect(cacheManager.set).toBeCalled();
    });

    it('should get token from cache', async () => {
      jest
        .spyOn(httpService, 'post')
        .mockResolvedValue(mockCelcoinAuthResponse);
      jest
        .spyOn(cacheManager, 'get')
        .mockResolvedValue(mockCelcoinAuthResponse);
      jest.spyOn(cacheManager, 'set').mockResolvedValue();
      const result = await celcoinApi.auth();
      expect(result).toBeDefined();
      expect(cacheManager.get).toBeCalled();
      expect(httpService.post).not.toBeCalled();
      expect(cacheManager.set).not.toBeCalled();
    });

    it('should throw PspAuthenticationException whem unknown error ocurred', async () => {
      jest.spyOn(cacheManager, 'get').mockResolvedValue(undefined);
      jest.spyOn(cacheManager, 'set').mockResolvedValue();
      jest.spyOn(httpService, 'post').mockRejectedValue(new Error('any'));

      await expect(celcoinApi.auth()).rejects.toThrowError(
        PspAuthenticationException,
      );
    });

    it('should throw PspAuthenticationException whem celcoin error', async () => {
      jest.spyOn(cacheManager, 'get').mockResolvedValue(undefined);
      jest.spyOn(cacheManager, 'set').mockResolvedValue();
      jest.spyOn(httpService, 'post').mockRejectedValue({
        response: {
          data: mockCelcoinErrorResponse,
        },
      });

      await expect(celcoinApi.auth()).rejects.toThrowError(
        new PspAuthenticationException(
          mockCelcoinErrorResponse.message as string,
          expect.any(Object),
        ),
      );
    });
  });

  describe('createLocation', () => {
    it('should createLocation successfully', async () => {
      jest
        .spyOn(httpService, 'post')
        .mockResolvedValue(mockCelcoinLocationResponse);
      const result = await celcoinApi.createLocation(
        mockCelcoinAuth,
        mockCreateLocationOnCelcoinRequest,
      );
      expect(result).toBeDefined();
      expect(httpService.post).toBeCalled();
    });

    it('should throw CreateImmediateChargeException whem unknown error ocurred', async () => {
      jest.spyOn(httpService, 'post').mockRejectedValue(new Error('any'));

      await expect(
        celcoinApi.createLocation(
          mockCelcoinAuth,
          mockCreateLocationOnCelcoinRequest,
        ),
      ).rejects.toThrowError(CreateImmediateChargeException);
    });

    it('should throw CreateImmediateChargeException whem celcoin error', async () => {
      jest.spyOn(httpService, 'post').mockRejectedValue({
        response: {
          data: mockCelcoinErrorResponse,
        },
      });

      await expect(
        celcoinApi.createLocation(
          mockCelcoinAuth,
          mockCreateLocationOnCelcoinRequest,
        ),
      ).rejects.toThrowError(
        new CreateImmediateChargeException(
          mockCelcoinErrorResponse.message as string,
          expect.any(Object),
        ),
      );
    });
  });

  describe('createImmediateCharge', () => {
    it('should createImmediateCharge successfully', async () => {
      jest
        .spyOn(httpService, 'post')
        .mockResolvedValue(mockCelcoinImmediateChargeResponse);
      const result = await celcoinApi.createImmediateCharge(
        mockCelcoinAuth,
        mockCelcoinImmediateChargeRequest,
      );
      expect(result).toBeDefined();
    });

    it('should throw CreateImmediateChargeException whem unknown error ocurred', async () => {
      jest.spyOn(httpService, 'post').mockRejectedValue(new Error('any'));

      await expect(
        celcoinApi.createImmediateCharge(
          mockCelcoinAuth,
          mockCelcoinImmediateChargeRequest,
        ),
      ).rejects.toThrowError(CreateImmediateChargeException);
    });

    it('should throw CreateImmediateChargeException whem celcoin error', async () => {
      jest.spyOn(httpService, 'post').mockRejectedValue({
        response: {
          data: mockCelcoinErrorResponse,
        },
      });

      await expect(
        celcoinApi.createImmediateCharge(
          mockCelcoinAuth,
          mockCelcoinImmediateChargeRequest,
        ),
      ).rejects.toThrowError(
        new CreateImmediateChargeException(
          mockCelcoinErrorResponse.message as string,
          expect.any(Object),
        ),
      );
    });
  });
});
