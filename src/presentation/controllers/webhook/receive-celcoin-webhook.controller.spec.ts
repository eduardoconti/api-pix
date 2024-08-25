import { Test, TestingModule } from '@nestjs/testing';

import { ReceiveWebhook, IReceiveWebhookUseCase } from '@app/use-cases';

import { mockCelcoinWebhook } from '@infra/__mocks__/celcoin.mock';

import { ReceiveCelcoinWebhookController } from './receive-celcoin-webhook.controller';

describe('ReceiveCelcoinWebhookController', () => {
  let receiveCelcoinWebhookController: ReceiveCelcoinWebhookController;
  let receiveCelcoinWebhookUseCase: IReceiveWebhookUseCase;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ReceiveCelcoinWebhookController],
      providers: [
        {
          provide: ReceiveWebhook,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    receiveCelcoinWebhookController = app.get<ReceiveCelcoinWebhookController>(
      ReceiveCelcoinWebhookController,
    );
    receiveCelcoinWebhookUseCase =
      app.get<IReceiveWebhookUseCase>(ReceiveWebhook);
  });

  it('should be defined', () => {
    expect(receiveCelcoinWebhookUseCase).toBeDefined();
    expect(receiveCelcoinWebhookController).toBeDefined();
  });
  it('should execute successfully', async () => {
    jest
      .spyOn(receiveCelcoinWebhookUseCase, 'execute')
      .mockResolvedValue('success');
    const result = await receiveCelcoinWebhookController.handle(
      mockCelcoinWebhook,
    );
    expect(result).toBeUndefined();
    expect(receiveCelcoinWebhookUseCase.execute).toBeCalledTimes(1);
  });
});
