import { Test, TestingModule } from '@nestjs/testing';

import { mockChargeEntity } from '@domain/__mocks__';
import { UUID } from '@domain/value-objects';

import { ChargeRepository } from './charge.repository';
import { ChargeModel } from './models';
import { PrismaService } from './prisma.service';

const model = ChargeModel.fromEntity(mockChargeEntity);
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

      await repository.save(mockChargeEntity);
      expect(prismaService.charge.create).toHaveBeenCalledWith({ data: model });
    });
  });

  describe('findOne', () => {
    it('should find charge register', async () => {
      jest.spyOn(prismaService.charge, 'findFirst').mockResolvedValue(model);
      const result = await repository.findOne({
        id: new UUID(model.id),
      });
      expect(result).toStrictEqual(mockChargeEntity);
      expect(prismaService.charge.findFirst).toBeCalled();
    });
  });

  describe('update', () => {
    it('should update charge register', async () => {
      jest.spyOn(prismaService.charge, 'update').mockResolvedValue(model);
      const result = await repository.update(mockChargeEntity);
      expect(result).toStrictEqual(mockChargeEntity);
      expect(prismaService.charge.update).toBeCalled();
    });
  });
});
