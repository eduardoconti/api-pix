import { Test, TestingModule } from '@nestjs/testing';

import {
  mockOutboxUserWebhookNotificationEntity,
  mockUserWebhookNotificationEntity,
} from '@domain/__mocks__';
import { IUserWebhookNotificationRepository } from '@domain/core';

import {
  UserWebhookNotificationNotFoundException,
  UserWebhookNotificationRepositoryException,
} from '@infra/exceptions';
import { provideUserWebhookNotificationRepository } from '@infra/infra.provider';

import { OutBoxModel, UserWebhookNotificationModel } from '../models';
import { PrismaService } from './prisma.service';
import { UserWebhookNotificationRepository } from './user-webhook-notification.repository';

describe('UserWebhookNotificationRepository', () => {
  let repository: IUserWebhookNotificationRepository;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        provideUserWebhookNotificationRepository,
        {
          provide: PrismaService,
          useValue: {
            user_webhook_notification: {
              create: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
            },
            outbox: {
              create: jest.fn(),
            },
            $transaction: jest.fn(),
          },
        },
      ],
    }).compile();

    repository = module.get<IUserWebhookNotificationRepository>(
      UserWebhookNotificationRepository,
    );
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
    expect(prismaService).toBeDefined();
  });

  const outBoxModel = OutBoxModel.fromEntity(
    mockOutboxUserWebhookNotificationEntity,
  );
  const userWebhookNotificationModel = UserWebhookNotificationModel.fromEntity(
    mockUserWebhookNotificationEntity,
  );
  describe('saveWithOutbox', () => {
    it('should save notification with outbox successfully', async () => {
      jest.spyOn(prismaService.outbox, 'create').mockResolvedValue(outBoxModel);

      jest
        .spyOn(prismaService.user_webhook_notification, 'create')
        .mockResolvedValue(userWebhookNotificationModel);

      jest
        .spyOn(prismaService, '$transaction')
        .mockResolvedValue([userWebhookNotificationModel, outBoxModel]);

      const result = await repository.saveWithOutbox(
        mockUserWebhookNotificationEntity,
        mockOutboxUserWebhookNotificationEntity,
      );

      expect(result).toBeDefined();
      expect(prismaService.outbox.create).toBeCalled();
      expect(prismaService.user_webhook_notification.create).toBeCalled();
      expect(prismaService.$transaction).toBeCalled();
    });

    it('should throw UserWebhookNotificationRepositoryException when prisma $transaction error', async () => {
      jest.spyOn(prismaService.outbox, 'create').mockResolvedValue(outBoxModel);

      jest
        .spyOn(prismaService.user_webhook_notification, 'create')
        .mockResolvedValue(userWebhookNotificationModel);

      jest
        .spyOn(prismaService, '$transaction')
        .mockRejectedValue(new Error('any error'));

      await expect(
        repository.saveWithOutbox(
          mockUserWebhookNotificationEntity,
          mockOutboxUserWebhookNotificationEntity,
        ),
      ).rejects.toThrowError(UserWebhookNotificationRepositoryException);

      expect(prismaService.outbox.create).toBeCalled();
      expect(prismaService.user_webhook_notification.create).toBeCalled();
      expect(prismaService.$transaction).toBeCalled();
    });
  });

  describe('findOneById', () => {
    it('should find register successfully', async () => {
      jest
        .spyOn(prismaService.user_webhook_notification, 'findUnique')
        .mockResolvedValue(userWebhookNotificationModel);
      const result = await repository.findOneById(
        mockUserWebhookNotificationEntity.id,
      );

      expect(result).toBeDefined();
      expect(prismaService.user_webhook_notification.findUnique).toBeCalled();
    });

    it('should throw UserWebhookNotificationRepositoryException when prisma error', async () => {
      jest
        .spyOn(prismaService.user_webhook_notification, 'findUnique')
        .mockRejectedValue(new Error('any error'));
      await expect(
        repository.findOneById(mockUserWebhookNotificationEntity.id),
      ).rejects.toThrowError(UserWebhookNotificationRepositoryException);
      expect(prismaService.user_webhook_notification.findUnique).toBeCalled();
    });

    it('should throw UserWebhookNotificationNotFoundException when user not found', async () => {
      jest
        .spyOn(prismaService.user_webhook_notification, 'findUnique')
        .mockResolvedValue(null);
      await expect(
        repository.findOneById(mockUserWebhookNotificationEntity.id),
      ).rejects.toThrowError(UserWebhookNotificationNotFoundException);
      expect(prismaService.user_webhook_notification.findUnique).toBeCalled();
    });
  });

  describe('update', () => {
    it('should update register successfully', async () => {
      jest
        .spyOn(prismaService.user_webhook_notification, 'update')
        .mockResolvedValue(userWebhookNotificationModel);
      const result = await repository.update(mockUserWebhookNotificationEntity);

      expect(result).toBeDefined();
      expect(prismaService.user_webhook_notification.update).toBeCalled();
    });

    it('should throw UserWebhookNotificationRepositoryException when prisma error', async () => {
      jest
        .spyOn(prismaService.user_webhook_notification, 'update')
        .mockRejectedValue(new Error('any error'));
      await expect(
        repository.update(mockUserWebhookNotificationEntity),
      ).rejects.toThrowError(UserWebhookNotificationRepositoryException);
      expect(prismaService.user_webhook_notification.update).toBeCalled();
    });
  });
});
