import { Test, TestingModule } from '@nestjs/testing';

import { provideChargePayedListener } from '@app/app.provider';

import {
  mockChargePayedDomainEvent,
  mockUserEntity,
  mockUserEntityWithoutHost,
} from '@domain/__mocks__';
import {
  IUserRepository,
  IUserWebhookNotificationRepository,
} from '@domain/core';
import { ArgumentInvalidException } from '@domain/exceptions';
import { UUID } from '@domain/value-objects';

import { UserRepositoryMongo } from '@infra/database/mongo';
import { UserWebhookNotificationRepository } from '@infra/database/prisma';

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
          provide: UserRepositoryMongo,
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
    userRepository = module.get(UserRepositoryMongo);
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
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUserEntity);
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

  it('should throw error when user does not have webhook registered', async () => {
    jest
      .spyOn(userRepository, 'findOne')
      .mockResolvedValue(mockUserEntityWithoutHost);
    jest
      .spyOn(userWebhookNotificationRepository, 'saveWithOutbox')
      .mockImplementation();
    await expect(
      listener.handle(mockChargePayedDomainEvent),
    ).rejects.toThrowError(ArgumentInvalidException);
    expect(userRepository.findOne).toBeCalledWith({
      id: new UUID(mockChargePayedDomainEvent.userId),
    });
    expect(userWebhookNotificationRepository.saveWithOutbox).not.toBeCalled();
  });
});
