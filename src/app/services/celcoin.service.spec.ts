import { Test, TestingModule } from '@nestjs/testing';

import {
  mockAuthenticateOnPSPResponse,
  mockCreateImmediateChargeOnPspInput,
  mockCreateImmediateChargeOnPSPResponse,
  mockCreateLocationOnPSPResponse,
} from '@app/__mocks__';
import { provideCelcoinService } from '@app/app.provider';
import { CelcoinService } from '@app/services';

import { CelcoinApi } from '@infra/celcoin';

describe('CelcoinService', () => {
  let celcoinService: CelcoinService;
  let celcoinApi: CelcoinApi;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: CelcoinApi,
          useValue: {
            auth: jest.fn(),
            createImmediateCharge: jest.fn(),
            createLocation: jest.fn(),
          },
        },
        provideCelcoinService,
      ],
    }).compile();

    celcoinService = app.get(CelcoinService);
    celcoinApi = app.get<CelcoinApi>(CelcoinApi);

    jest
      .spyOn(celcoinApi, 'auth')
      .mockResolvedValue(mockAuthenticateOnPSPResponse);
    jest
      .spyOn(celcoinApi, 'createLocation')
      .mockResolvedValue(mockCreateLocationOnPSPResponse);
    jest
      .spyOn(celcoinApi, 'createImmediateCharge')
      .mockResolvedValue(mockCreateImmediateChargeOnPSPResponse);
  });

  it('should be defined', () => {
    expect(celcoinApi).toBeDefined();
    expect(celcoinService).toBeDefined();
  });

  describe('create immediate charge', () => {
    it('should create immediate charge successfully', async () => {
      const result = await celcoinService.createImmediateCharge(
        mockCreateImmediateChargeOnPspInput,
      );
      expect(result).toBeDefined();
      expect(celcoinApi.auth).toBeCalledTimes(1);
      expect(celcoinApi.createLocation).toBeCalledTimes(1);
      expect(celcoinApi.createImmediateCharge).toBeCalledTimes(1);
    });
  });
});
