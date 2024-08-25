import { Test, TestingModule } from '@nestjs/testing';

import { mockCreateImmediateChargeOnPSPResponse } from '@app/__mocks__';
import {
  CelcoinImmediateChargeCreator,
  CreateImmediateCharge,
  ICreateImmediateChargeUseCase,
  IImmediateChargeCreatorStrategy,
} from '@app/use-cases';

import {
  mockCreateImmediateChargeInput,
  mockTokenPayload,
} from '@presentation/__mocks__';

import { CreateImmediateChargeController } from './create-immediate-charge.controller';

describe('CreateImmediateChargeController', () => {
  let createImmediateChargeController: CreateImmediateChargeController;
  let createImmediateChargeUseCase: ICreateImmediateChargeUseCase;
  let strategy: IImmediateChargeCreatorStrategy;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [CreateImmediateChargeController],
      providers: [
        {
          provide: CreateImmediateCharge,
          useValue: {
            execute: jest.fn(),
            setStrategy: jest.fn(),
          },
        },
        {
          provide: CelcoinImmediateChargeCreator,
          useValue: {
            createImmediateCharge: jest.fn(),
            createChargeEntity: jest.fn(),
          },
        },
      ],
    }).compile();

    createImmediateChargeController = app.get<CreateImmediateChargeController>(
      CreateImmediateChargeController,
    );
    createImmediateChargeUseCase = app.get<ICreateImmediateChargeUseCase>(
      CreateImmediateCharge,
    );
    strategy = app.get<IImmediateChargeCreatorStrategy>(
      CelcoinImmediateChargeCreator,
    );
  });

  it('should be defined', () => {
    expect(createImmediateChargeUseCase).toBeDefined();
    expect(createImmediateChargeController).toBeDefined();
    expect(strategy).toBeDefined();
  });
  it('should execute successfully', async () => {
    jest.spyOn(createImmediateChargeUseCase, 'execute').mockResolvedValue({
      ...mockCreateImmediateChargeOnPSPResponse,
      qrCode: 'any',
      emv: 'any',
      transactionId: '83ef6455-f9aa-472f-a705-a87baa87489a',
    });
    const result = await createImmediateChargeController.handle(
      mockCreateImmediateChargeInput,
      mockTokenPayload,
    );
    expect(result).toBeDefined();
    expect(result).toEqual(
      expect.objectContaining({
        psp_transaction_id: expect.any(String),
        status: 'ACTIVE',
        amount: 810,
        expiration: expect.any(Number),
        emv: expect.any(String),
        location_id: expect.any(String),
        url: expect.any(String),
        last_update: expect.any(String),
        created_at: expect.any(String),
      }),
    );
    expect(createImmediateChargeUseCase.execute).toBeCalledTimes(1);
    expect(createImmediateChargeUseCase.setStrategy).toBeCalledWith(strategy);
  });
});
