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

describe('CreateImmediateChargeUseCase', () => {
  let pspService: IPspService;
  let createImmediateChargeUseCase: ICreateImmediateChargeUseCase;

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
      ],
    }).compile();

    pspService = app.get<IPspService>(PspService);
    createImmediateChargeUseCase = app.get<ICreateImmediateChargeUseCase>(
      CreateImmediateChargeUseCase,
    );
  });

  describe('CreateImmediateChargeUseCase', () => {
    it('should be defined', () => {
      expect(createImmediateChargeUseCase).toBeDefined();
      expect(pspService).toBeDefined();
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
