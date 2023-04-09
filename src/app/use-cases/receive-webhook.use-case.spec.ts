import { Test, TestingModule } from '@nestjs/testing';

import { provideReceiveWebhookUseCase } from '@app/app.provider';

import { mockWebhookEntity } from '@domain/__mocks__/webhook.mock';
import { IWebhookRepository } from '@domain/core/repository';

import { mockCelcoinWebhook } from '@infra/__mocks__/celcoin.mock';
import { WebhookRepositoryMongo } from '@infra/database/mongo';

import { WebhookCelcoinInput } from '@presentation/dto';

import {
  IReceiveWebhookUseCase,
  ReceiveWebhookUseCase,
} from './receive-webhook.use-case';

describe('ReceiveWebhookUseCase', () => {
  let WebhookUseCase: IReceiveWebhookUseCase;

  let chargeRepository: IWebhookRepository;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        provideReceiveWebhookUseCase,
        {
          provide: WebhookRepositoryMongo,
          useValue: {
            save: jest.fn(),
            saveWithOutbox: jest.fn(),
          },
        },
      ],
    }).compile();

    WebhookUseCase = app.get<IReceiveWebhookUseCase>(ReceiveWebhookUseCase);
    chargeRepository = app.get<IWebhookRepository>(WebhookRepositoryMongo);

    jest
      .spyOn(chargeRepository, 'saveWithOutbox')
      .mockResolvedValue(mockWebhookEntity);
  });

  describe('ReceiveWebhookUseCase', () => {
    it('should be defined', () => {
      expect(WebhookUseCase).toBeDefined();
      expect(chargeRepository).toBeDefined();
    });
    it('should execute successfully', async () => {
      const result = await WebhookUseCase.execute(
        WebhookCelcoinInput.toUseCaseInput(mockCelcoinWebhook),
      );
      expect(result).toBe('success');
      expect(chargeRepository.saveWithOutbox).toBeCalled();
    });
  });
});
