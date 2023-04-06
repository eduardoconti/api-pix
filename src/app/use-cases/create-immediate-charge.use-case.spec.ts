import { EventEmitter2 } from '@nestjs/event-emitter';
import { Test, TestingModule } from '@nestjs/testing';

import {
  mockCreateImmediateChargeUseCaseInput,
  mockCreateImmediateChargeOnPSPResponse,
} from '@app/__mocks__';
import { provideCreateImmediateChargeUseCase } from '@app/app.provider';
import { IPspService } from '@app/contracts';
import { CreateChargeException } from '@app/exceptions';
import { PspService } from '@app/services';
import {
  CreateImmediateChargeUseCase,
  ICreateImmediateChargeUseCase,
} from '@app/use-cases';

import {
  mockActiveChargeEntity,
  mockFailedChargeEntity,
  mockPendingChargeEntity,
} from '@domain/__mocks__';
import { IEventEmitter } from '@domain/core';
import { IChargeRepository } from '@domain/core/repository';

import { ChargeRepository } from '@infra/database/prisma';
import { CreateImmediateChargeException } from '@infra/exceptions';

describe('CreateImmediateChargeUseCase', () => {
  let pspService: IPspService;
  let createImmediateChargeUseCase: ICreateImmediateChargeUseCase;
  let eventEmitter: IEventEmitter;
  let chargeRepository: IChargeRepository;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        provideCreateImmediateChargeUseCase,
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
        {
          provide: ChargeRepository,
          useValue: {
            save: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    pspService = app.get<IPspService>(PspService);
    createImmediateChargeUseCase = app.get<ICreateImmediateChargeUseCase>(
      CreateImmediateChargeUseCase,
    );
    eventEmitter = app.get<IEventEmitter>(EventEmitter2);
    chargeRepository = app.get<IChargeRepository>(ChargeRepository);

    jest
      .spyOn(chargeRepository, 'save')
      .mockResolvedValue(mockPendingChargeEntity);
    jest
      .spyOn(chargeRepository, 'update')
      .mockResolvedValue(mockActiveChargeEntity);
    jest.spyOn(eventEmitter, 'emitAsync').mockResolvedValueOnce(undefined);
  });

  describe('CreateImmediateChargeUseCase', () => {
    it('should be defined', () => {
      expect(createImmediateChargeUseCase).toBeDefined();
      expect(pspService).toBeDefined();
      expect(eventEmitter).toBeDefined();
      expect(chargeRepository).toBeDefined();
    });
    it('should execute successfully', async () => {
      jest
        .spyOn(pspService, 'createImmediateCharge')
        .mockResolvedValue(mockCreateImmediateChargeOnPSPResponse);

      const result = await createImmediateChargeUseCase.execute(
        mockCreateImmediateChargeUseCaseInput,
      );
      expect(result).toBeDefined();
      expect(pspService.createImmediateCharge).toBeCalled();
      expect(eventEmitter.emitAsync).toBeCalled();
      expect(chargeRepository.save).toBeCalled();
      expect(chargeRepository.update).toBeCalledTimes(1);
    });

    it('should save transaction with status FAILED and throw error when pspService failed', async () => {
      jest
        .spyOn(pspService, 'createImmediateCharge')
        .mockRejectedValue(new Error('any'));

      jest
        .spyOn(chargeRepository, 'update')
        .mockResolvedValue(mockFailedChargeEntity);
      await expect(
        createImmediateChargeUseCase.execute(
          mockCreateImmediateChargeUseCaseInput,
        ),
      ).rejects.toThrowError(CreateChargeException);
      expect(chargeRepository.save).toBeCalled();
      expect(pspService.createImmediateCharge).toBeCalled();
      expect(eventEmitter.emitAsync).not.toBeCalled();
      expect(chargeRepository.update).toBeCalledTimes(1);
    });

    it('should save transaction with status FAILED and throw error when pspService failed with BaseException', async () => {
      jest
        .spyOn(pspService, 'createImmediateCharge')
        .mockRejectedValue(new CreateImmediateChargeException('any'));
      await expect(
        createImmediateChargeUseCase.execute(
          mockCreateImmediateChargeUseCaseInput,
        ),
      ).rejects.toThrowError(CreateImmediateChargeException);
      expect(pspService.createImmediateCharge).toBeCalled();
      expect(chargeRepository.save).toBeCalled();
      expect(eventEmitter.emitAsync).not.toBeCalled();
      expect(chargeRepository.update).toBeCalledTimes(1);
    });
  });
});
