import { Test, TestingModule } from '@nestjs/testing';

import { mockOutboxEntityWebhook, mockWebhookEntity } from '@domain/__mocks__';
import { IWebhookRepository } from '@domain/core/repository';

import { WebhookRepositoryException } from '@infra/exceptions';

import { OutBoxModel, WebhookModel } from '../models';
import { PrismaService } from './prisma.service';
import { WebhookRepository } from './webhook.repository';

describe('WebhookRepository', () => {
  let repository: IWebhookRepository;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WebhookRepository,
        {
          provide: PrismaService,
          useValue: {
            webhook: {
              create: jest.fn(),
            },
            outbox: {
              create: jest.fn(),
            },
            $transaction: jest.fn(),
          },
        },
      ],
    }).compile();

    repository = module.get<IWebhookRepository>(WebhookRepository);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
    expect(prismaService).toBeDefined();
  });
  describe('save', () => {
    it('should create a new webhook using PrismaService', async () => {
      const model = WebhookModel.fromEntity(mockWebhookEntity);
      jest.spyOn(prismaService.webhook, 'create').mockResolvedValue(model);

      await repository.save(mockWebhookEntity);
      expect(prismaService.webhook.create).toHaveBeenCalledWith({
        data: model,
      });
    });

    it('should create a new webhook with outbox using PrismaService', async () => {
      const model = WebhookModel.fromEntity(mockWebhookEntity);
      const outbox = OutBoxModel.fromEntity(mockOutboxEntityWebhook);
      jest
        .spyOn(prismaService, '$transaction')
        .mockResolvedValue([model, outbox]);
      await repository.saveWithOutbox(
        mockWebhookEntity,
        mockOutboxEntityWebhook,
      );
      expect(prismaService.webhook.create).toHaveBeenCalledWith({
        data: model,
      });
      expect(prismaService.outbox.create).toHaveBeenCalledWith({
        data: outbox,
      });
      expect(prismaService.$transaction).toBeCalled();
    });

    it('should throw OutboxRepositoryException when save failed', async () => {
      jest
        .spyOn(prismaService.webhook, 'create')
        .mockRejectedValue(new Error('any'));

      await expect(repository.save(mockWebhookEntity)).rejects.toThrowError(
        WebhookRepositoryException,
      );
    });

    it('should throw OutboxRepositoryException when saveWithOutbox failed', async () => {
      jest
        .spyOn(prismaService, '$transaction')
        .mockRejectedValue(new Error('any'));

      await expect(
        repository.saveWithOutbox(mockWebhookEntity, mockOutboxEntityWebhook),
      ).rejects.toThrowError(WebhookRepositoryException);
    });
  });
});
