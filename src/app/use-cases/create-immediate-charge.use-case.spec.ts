import { EventEmitter2 } from '@nestjs/event-emitter';
import { Test, TestingModule } from '@nestjs/testing';

import {
  mockCreateImmediateChargeUseCaseInput,
  mockCreateImmediateChargeOnPSPResponse,
} from '@app/__mocks__';
import { provideCreateImmediateChargeUseCase } from '@app/app.provider';
import { CreateChargeException } from '@app/exceptions';
import {
  CelcoinImmediateChargeCreator,
  CreateImmediateCharge,
  ICreateImmediateChargeUseCase,
  IImmediateChargeCreatorStrategy,
} from '@app/use-cases';

import {
  mockActiveChargeEntity,
  mockFailedChargeEntity,
  mockPendingChargeEntity,
} from '@domain/__mocks__';
import { IEventEmitter } from '@domain/core';
import { IChargeRepository } from '@domain/core/repository';

import { ChargeRepositoryMongo } from '@infra/database/mongo';
import { CreateImmediateChargeException } from '@infra/exceptions';

describe('CreateImmediateChargeUseCase', () => {
  let strategy: IImmediateChargeCreatorStrategy;
  let createImmediateChargeUseCase: ICreateImmediateChargeUseCase;
  let eventEmitter: IEventEmitter;
  let chargeRepository: IChargeRepository;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        provideCreateImmediateChargeUseCase,
        {
          provide: CelcoinImmediateChargeCreator,
          useValue: {
            createImmediateCharge: jest.fn(),
            createChargeEntity: jest.fn(),
          },
        },
        {
          provide: EventEmitter2,
          useValue: {
            emitAsync: jest.fn(),
          },
        },
        {
          provide: ChargeRepositoryMongo,
          useValue: {
            save: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    strategy = app.get<IImmediateChargeCreatorStrategy>(
      CelcoinImmediateChargeCreator,
    );
    createImmediateChargeUseCase =
      await app.resolve<ICreateImmediateChargeUseCase>(CreateImmediateCharge);
    eventEmitter = app.get<IEventEmitter>(EventEmitter2);
    chargeRepository = app.get<IChargeRepository>(ChargeRepositoryMongo);
    createImmediateChargeUseCase.setStrategy(strategy);

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
      expect(strategy).toBeDefined();
      expect(eventEmitter).toBeDefined();
      expect(chargeRepository).toBeDefined();
    });
    it('should execute successfully', async () => {
      jest
        .spyOn(strategy, 'createChargeEntity')
        .mockReturnValue(mockPendingChargeEntity);
      jest
        .spyOn(strategy, 'createImmediateCharge')
        .mockResolvedValue({ data: mockCreateImmediateChargeOnPSPResponse });

      const result = await createImmediateChargeUseCase.execute(
        mockCreateImmediateChargeUseCaseInput,
      );
      expect(result).toBeDefined();
      expect(strategy.createImmediateCharge).toBeCalled();
      expect(eventEmitter.emitAsync).toBeCalled();
      expect(chargeRepository.save).toBeCalled();
      expect(chargeRepository.update).toBeCalledTimes(1);
    });

    it('should save transaction with status FAILED and throw error when pspService failed', async () => {
      jest
        .spyOn(strategy, 'createImmediateCharge')
        .mockResolvedValue({ error: new Error('any'), data: {} as any });

      jest
        .spyOn(chargeRepository, 'update')
        .mockResolvedValue(mockFailedChargeEntity);
      await expect(
        createImmediateChargeUseCase.execute(
          mockCreateImmediateChargeUseCaseInput,
        ),
      ).rejects.toThrowError(CreateChargeException);
      expect(chargeRepository.save).toBeCalled();
      expect(strategy.createImmediateCharge).toBeCalled();
      expect(eventEmitter.emitAsync).not.toBeCalled();
      expect(chargeRepository.update).toBeCalledTimes(1);
    });

    it('should save transaction with status FAILED and throw error when pspService failed with BaseException', async () => {
      jest.spyOn(strategy, 'createImmediateCharge').mockRejectedValue({
        error: new CreateImmediateChargeException('any'),
        data: {} as any,
      });
      await expect(
        createImmediateChargeUseCase.execute(
          mockCreateImmediateChargeUseCaseInput,
        ),
      ).rejects.toThrowError(CreateImmediateChargeException);
      expect(strategy.createImmediateCharge).toBeCalled();
      expect(chargeRepository.save).toBeCalled();
      expect(eventEmitter.emitAsync).not.toBeCalled();
      expect(chargeRepository.update).toBeCalledTimes(1);
    });
  });
});
