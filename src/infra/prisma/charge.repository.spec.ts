import { Test, TestingModule } from '@nestjs/testing';

import { mockChargeEntity } from '@domain/__mocks__';

import { ChargeRepository } from './charge.repository';
import { ChargeModel } from './models';
import { PrismaService } from './prisma.service';

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
      const model = ChargeModel.fromEntity(mockChargeEntity);
      jest.spyOn(prismaService.charge, 'create').mockResolvedValue(model);
      await repository.save(mockChargeEntity);
      expect(prismaService.charge.create).toHaveBeenCalledWith({ data: model });
    });
  });
});
