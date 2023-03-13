import { Test, TestingModule } from '@nestjs/testing';

import { mockPendingChargeEntity } from '@domain/__mocks__';
import { UUID } from '@domain/value-objects';

import {
  ChargeNotFoundException,
  ChargeRepositoryException,
} from '@infra/exceptions';

import { ChargeRepository } from './charge.repository';
import { ChargeModel } from './models';
import { PrismaService } from './prisma.service';

const model = ChargeModel.fromEntity(mockPendingChargeEntity);
describe('ChargeRepository', () => {
  let repository: ChargeRepository;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChargeRepository,
        {
          provide: PrismaService,
          useValue: {
            charge: {
              create: jest.fn(),
              findFirst: jest.fn(),
              update: jest.fn(),
              findMany: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    repository = module.get<ChargeRepository>(ChargeRepository);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('save', () => {
    it('should create a new charge using PrismaService', async () => {
      jest.spyOn(prismaService.charge, 'create').mockResolvedValue(model);

      await repository.save(mockPendingChargeEntity);
      expect(prismaService.charge.create).toHaveBeenCalledWith({ data: model });
    });

    it('should throw ChargeRepositoryException when create failed', async () => {
      jest
        .spyOn(prismaService.charge, 'create')
        .mockRejectedValue(new Error('any'));

      await expect(
        repository.save(mockPendingChargeEntity),
      ).rejects.toThrowError(ChargeRepositoryException);
    });
  });

  describe('findOne', () => {
    it('should find charge register', async () => {
      jest.spyOn(prismaService.charge, 'findFirst').mockResolvedValue(model);
      const result = await repository.findOne({
        id: new UUID(model.id),
      });
      expect(result).toStrictEqual(mockPendingChargeEntity);
      expect(prismaService.charge.findFirst).toBeCalled();
    });

    it('should throw ChargeRepositoryException when findOne failed', async () => {
      jest
        .spyOn(prismaService.charge, 'findFirst')
        .mockRejectedValue(new Error('any'));

      await expect(
        repository.findOne({
          id: new UUID(model.id),
        }),
      ).rejects.toThrowError(ChargeRepositoryException);
    });

    it('should throw ChargeNotFoundException when charge not found', async () => {
      jest.spyOn(prismaService.charge, 'findFirst').mockResolvedValue(null);

      await expect(
        repository.findOne({
          id: new UUID(model.id),
        }),
      ).rejects.toThrowError(ChargeNotFoundException);
    });
  });

  describe('update', () => {
    it('should update charge register', async () => {
      jest.spyOn(prismaService.charge, 'update').mockResolvedValue(model);
      const result = await repository.update(mockPendingChargeEntity);
      expect(result).toStrictEqual(mockPendingChargeEntity);
      expect(prismaService.charge.update).toBeCalled();
    });

    it('should throw ChargeRepositoryException when updata failed', async () => {
      jest
        .spyOn(prismaService.charge, 'update')
        .mockRejectedValue(new Error('any'));

      await expect(
        repository.update(mockPendingChargeEntity),
      ).rejects.toThrowError(ChargeRepositoryException);
    });
  });

  describe('findMany', () => {
    it('should find charge register', async () => {
      jest.spyOn(prismaService.charge, 'findMany').mockResolvedValue([model]);
      const result = await repository.findMany({});
      expect(result).toStrictEqual([mockPendingChargeEntity]);
      expect(prismaService.charge.findMany).toBeCalled();
    });

    it('should throw ChargeRepositoryException when findMany failed', async () => {
      jest
        .spyOn(prismaService.charge, 'findMany')
        .mockRejectedValue(new Error('any'));

      await expect(
        repository.findMany({
          id: new UUID(model.id),
        }),
      ).rejects.toThrowError(ChargeRepositoryException);
    });
  });
});
