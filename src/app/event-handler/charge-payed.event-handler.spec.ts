import { Test, TestingModule } from '@nestjs/testing';

import { provideChargePayedListener } from '@app/app.provider';

import { mockChargePayedDomainEvent, userEntityMock } from '@domain/__mocks__';
import {
  IUserRepository,
  IUserWebhookNotificationRepository,
} from '@domain/core';
import { UUID } from '@domain/value-objects';

import {
  UserRepository,
  UserWebhookNotificationRepository,
} from '@infra/prisma';

import { ChargePayedListener } from './charge-payed.event-handler';

describe('ChargePayedListener', () => {
  let listener: ChargePayedListener;
  let userWebhookNotificationRepository: IUserWebhookNotificationRepository;
  let userRepository: IUserRepository;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        provideChargePayedListener,
        {
          provide: UserRepository,
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: UserWebhookNotificationRepository,
          useValue: {
            saveWithOutbox: jest.fn(),
          },
        },
      ],
    }).compile();

    listener = module.get<ChargePayedListener>(ChargePayedListener);
    userWebhookNotificationRepository = module.get(
      UserWebhookNotificationRepository,
    );
    userRepository = module.get(UserRepository);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(listener).toBeDefined();
    expect(userWebhookNotificationRepository).toBeDefined();
    expect(userRepository).toBeDefined();
  });
  it('should handle successfully', async () => {
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(userEntityMock);
    jest
      .spyOn(userWebhookNotificationRepository, 'saveWithOutbox')
      .mockImplementation();
    const result = await listener.handle(mockChargePayedDomainEvent);
    expect(result).toBeUndefined();
    expect(userRepository.findOne).toBeCalledWith({
      id: new UUID(mockChargePayedDomainEvent.userId),
    });
    expect(userWebhookNotificationRepository.saveWithOutbox).toBeCalled();
  });
});
