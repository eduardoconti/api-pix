import { Test, TestingModule } from '@nestjs/testing';

import { mockOutboxEntity } from '@domain/__mocks__';
import { IOutboxRepository } from '@domain/core/repository';
import { UUID } from '@domain/value-objects';

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
  });

  describe('findMany', () => {
    it('should find many outbox register', async () => {
      jest.spyOn(prismaService.outbox, 'findMany').mockResolvedValue([outbox]);
      const result = await repository.findMany({
        id: new UUID(outbox.id),
      });
      expect(result).toStrictEqual([mockOutboxEntity]);
      expect(prismaService.outbox.findMany).toBeCalled();
    });
  });

  describe('update', () => {
    it('should update outbox register', async () => {
      jest.spyOn(prismaService.outbox, 'update').mockResolvedValue(outbox);
      const result = await repository.update(mockOutboxEntity);
      expect(result).toStrictEqual(mockOutboxEntity);
      expect(prismaService.outbox.update).toBeCalled();
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
  });
});
