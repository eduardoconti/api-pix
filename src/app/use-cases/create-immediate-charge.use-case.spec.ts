import { EventEmitter2 } from '@nestjs/event-emitter';
import { Test, TestingModule } from '@nestjs/testing';

import {
  mockCreateImmediateChargeOnPspInput,
  mockCreateImmediateChargeOnPSPResponse,
} from '@app/__mocks__';
import { IPspService } from '@app/contracts';
import { CreateChargeException } from '@app/exceptions';
import { PspService } from '@app/services';
import {
  CreateImmediateChargeUseCase,
  ICreateImmediateChargeUseCase,
} from '@app/use-cases';

import { IEventEmitter } from '@domain/core';

describe('CreateImmediateChargeUseCase', () => {
  let pspService: IPspService;
  let createImmediateChargeUseCase: ICreateImmediateChargeUseCase;
  let eventEmitter: IEventEmitter;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        CreateImmediateChargeUseCase,
        {
          provide: PspService,
          useValue: {
            createImmediateCharge: jest.fn(),
          },
        },
        {
          provide: EventEmitter2,
          useValue: {
            emitAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    pspService = app.get<IPspService>(PspService);
    createImmediateChargeUseCase = app.get<ICreateImmediateChargeUseCase>(
      CreateImmediateChargeUseCase,
    );
    eventEmitter = app.get<IEventEmitter>(EventEmitter2);
  });

  describe('CreateImmediateChargeUseCase', () => {
    it('should be defined', () => {
      expect(createImmediateChargeUseCase).toBeDefined();
      expect(pspService).toBeDefined();
      expect(eventEmitter).toBeDefined();
    });
    it('should execute successfully', async () => {
      jest
        .spyOn(pspService, 'createImmediateCharge')
        .mockResolvedValue(mockCreateImmediateChargeOnPSPResponse);
      const result = await createImmediateChargeUseCase.execute(
        mockCreateImmediateChargeOnPspInput,
      );
      expect(result).toBeDefined();
      expect(pspService.createImmediateCharge).toBeCalled();
    });

    it('should throw error when pspService failed', async () => {
      jest
        .spyOn(pspService, 'createImmediateCharge')
        .mockRejectedValue(new Error('any'));
      await expect(
        createImmediateChargeUseCase.execute(
          mockCreateImmediateChargeOnPspInput,
        ),
      ).rejects.toThrowError(CreateChargeException);
      expect(pspService.createImmediateCharge).toBeCalled();
    });
  });
});
