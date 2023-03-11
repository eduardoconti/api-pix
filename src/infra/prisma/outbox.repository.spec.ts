import { Test, TestingModule } from '@nestjs/testing';

import { mockOutboxEntity } from '@domain/__mocks__';
import { IOutboxRepository } from '@domain/core/repository';
import { UUID } from '@domain/value-objects';

import {
  OutboxNotFoundException,
  OutboxRepositoryException,
} from '@infra/exceptions';

import { OutBoxModel } from './models';
import { OutboxRepository } from './outbox.repository';
import { PrismaService } from './prisma.service';

const outbox = OutBoxModel.fromEntity(mockOutboxEntity);
describe('OutboxRepository', () => {
  let repository: IOutboxRepository;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OutboxRepository,
        {
          provide: PrismaService,
          useValue: {
            outbox: {
              create: jest.fn(),
              findFirst: jest.fn(),
              findMany: jest.fn(),
              update: jest.fn(),
            },
            $transaction: jest.fn(),
            $queryRawUnsafe: jest.fn(),
          },
        },
      ],
    }).compile();

    repository = module.get<IOutboxRepository>(OutboxRepository);
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
    it('should create a new outbox register using PrismaService', async () => {
      jest.spyOn(prismaService.outbox, 'create').mockResolvedValue(outbox);
      await repository.save(mockOutboxEntity);
      expect(prismaService.outbox.create).toBeCalledWith({
        data: outbox,
      });
    });

    it('should throw OutboxRepositoryException when create failed', async () => {
      jest
        .spyOn(prismaService.outbox, 'create')
        .mockRejectedValue(new Error('any'));

      await expect(repository.save(mockOutboxEntity)).rejects.toThrowError(
        OutboxRepositoryException,
      );
    });
  });

  describe('findOne', () => {
    it('should find outbox register', async () => {
      jest.spyOn(prismaService.outbox, 'findFirst').mockResolvedValue(outbox);
      const result = await repository.findOne({
        id: new UUID(outbox.id),
      });
      expect(result).toStrictEqual(mockOutboxEntity);
      expect(prismaService.outbox.findFirst).toBeCalled();
    });

    it('should throw OutboxRepositoryException when findOne failed', async () => {
      jest
        .spyOn(prismaService.outbox, 'findFirst')
        .mockRejectedValue(new Error('any'));

      await expect(
        repository.findOne({
          id: new UUID(outbox.id),
        }),
      ).rejects.toThrowError(OutboxRepositoryException);
    });

    it('should throw OutboxNotFoundException when findOne failed', async () => {
      jest.spyOn(prismaService.outbox, 'findFirst').mockResolvedValue(null);
      await expect(repository.findOne({})).rejects.toThrowError(
        OutboxNotFoundException,
      );
    });
  });

  describe('findMany', () => {
    it('should find many outbox register without params', async () => {
      jest.spyOn(prismaService.outbox, 'findMany').mockResolvedValue([outbox]);
      const result = await repository.findMany({});
      expect(result).toStrictEqual([mockOutboxEntity]);
      expect(prismaService.outbox.findMany).toBeCalled();
    });

    it('should find many outbox register with params', async () => {
      jest.spyOn(prismaService.outbox, 'findMany').mockResolvedValue([outbox]);
      const result = await repository.findMany({
        published: false,
        aggregateId: new UUID('b85381d7-174f-4c0a-a2c8-aa93a399965d'),
        aggregateType: 'WEBHOOK',
      });
      expect(result).toStrictEqual([mockOutboxEntity]);
      expect(prismaService.outbox.findMany).toBeCalled();
    });

    it('should throw OutboxRepositoryException when findMany failed', async () => {
      jest
        .spyOn(prismaService.outbox, 'findMany')
        .mockRejectedValue(new Error('any'));

      await expect(
        repository.findMany({
          id: new UUID(outbox.id),
        }),
      ).rejects.toThrowError(OutboxRepositoryException);
    });
  });

  describe('update', () => {
    it('should update outbox register', async () => {
      jest.spyOn(prismaService.outbox, 'update').mockResolvedValue(outbox);
      const result = await repository.update(mockOutboxEntity);
      expect(result).toStrictEqual(mockOutboxEntity);
      expect(prismaService.outbox.update).toBeCalled();
    });

    it('should throw OutboxRepositoryException when update failed', async () => {
      jest
        .spyOn(prismaService.outbox, 'update')
        .mockRejectedValue(new Error('any'));

      await expect(repository.update(mockOutboxEntity)).rejects.toThrowError(
        OutboxRepositoryException,
      );
    });
  });

  describe('sql $queryRawUnsafe', () => {
    it('should execute sql', async () => {
      jest.spyOn(prismaService, '$queryRawUnsafe').mockResolvedValue(undefined);
      const result = await repository.sql(
        `DELETE FROM outbox WHERE published = true AND created_at < NOW() - INTERVAL '12 hours'`,
      );
      expect(result).toBeUndefined();
      expect(prismaService.$queryRawUnsafe).toBeCalled();
    });

    it('should throw OutboxRepositoryException when sql failed', async () => {
      jest
        .spyOn(prismaService, '$queryRawUnsafe')
        .mockRejectedValue(new Error('any'));

      await expect(
        repository.sql(
          `DELETE FROM outbox WHERE published = true AND created_at < NOW() - INTERVAL '12 hours'`,
        ),
      ).rejects.toThrowError(OutboxRepositoryException);
    });
  });
});
