import { Test, TestingModule } from '@nestjs/testing';

import { mockCreateImmediateChargeOnPSPResponse } from '@app/__mocks__';
import { IPspService } from '@app/contracts';
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
      const result = await createImmediateChargeUseCase.execute();
      expect(result).toBeDefined();
      expect(pspService.createImmediateCharge).toBeCalled();
    });
  });
});
