import { Test, TestingModule } from '@nestjs/testing';

import { mockUserEntity, mockUserEntityWithoutHost } from '@domain/__mocks__';
import { IUserRepository } from '@domain/core';

import {
  UserNotFoundException,
  UserRepositoryException,
} from '@infra/exceptions';
import { provideUserRepository } from '@infra/infra.provider';

import { UserModel } from '../models';
import { PrismaService } from './prisma.service';
import { UserRepository } from './user.repository';

describe('UserRepository', () => {
  let userRepository: IUserRepository;
  let prismaService: PrismaService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        provideUserRepository,
        {
          provide: PrismaService,
          useValue: {
            user: {
              create: jest.fn(),
              findFirst: jest.fn(),
              findMany: jest.fn(),
              update: jest.fn(),
              findUnique: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    userRepository = module.get<IUserRepository>(UserRepository);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(userRepository).toBeDefined();
    expect(prismaService).toBeDefined();
  });

  describe('save', () => {
    it('shouls save user successfully', async () => {
      jest
        .spyOn(prismaService.user, 'create')
        .mockResolvedValue(UserModel.fromEntity(mockUserEntity));
      const result = await userRepository.save(mockUserEntity);
      expect(result).toBeDefined();
    });

    it('shouls save user without webhookHosts successfully', async () => {
      jest
        .spyOn(prismaService.user, 'create')
        .mockResolvedValue(UserModel.fromEntity(mockUserEntityWithoutHost));
      const result = await userRepository.save(mockUserEntityWithoutHost);
      expect(result).toBeDefined();
    });

    it('should throw UserRepositoryException when prisma failed', async () => {
      jest
        .spyOn(prismaService.user, 'create')
        .mockRejectedValue(new Error('db error'));

      await expect(userRepository.save(mockUserEntity)).rejects.toThrowError(
        UserRepositoryException,
      );
    });
  });

  describe('findOne', () => {
    it('shouls findOne by Id successfully', async () => {
      jest
        .spyOn(prismaService.user, 'findFirst')
        .mockResolvedValue(UserModel.fromEntity(mockUserEntity));
      const result = await userRepository.findOne({ id: mockUserEntity.id });
      expect(result).toBeDefined();
    });

    it('shouls findOne by Email successfully', async () => {
      jest
        .spyOn(prismaService.user, 'findFirst')
        .mockResolvedValue(UserModel.fromEntity(mockUserEntity));
      const result = await userRepository.findOne({
        email: mockUserEntity.props.email,
      });
      expect(result).toBeDefined();
    });

    it('should throw UserRepositoryException when prisma failed', async () => {
      jest
        .spyOn(prismaService.user, 'findFirst')
        .mockRejectedValue(new Error('db error'));

      await expect(userRepository.findOne(mockUserEntity)).rejects.toThrowError(
        UserRepositoryException,
      );
    });

    it('should throw UserNotFoundException when register does exists', async () => {
      jest.spyOn(prismaService.user, 'findFirst').mockResolvedValue(null);

      await expect(userRepository.findOne(mockUserEntity)).rejects.toThrowError(
        UserNotFoundException,
      );
    });
  });

  describe('findMany', () => {
    it('shouls findMany user successfully', async () => {
      jest
        .spyOn(prismaService.user, 'findMany')
        .mockResolvedValue([UserModel.fromEntity(mockUserEntity)]);
      const result = await userRepository.findMany(mockUserEntity);
      expect(result).toBeDefined();
      expect(result).toStrictEqual(expect.arrayContaining([mockUserEntity]));
    });

    it('should throw UserRepositoryException when prisma failed', async () => {
      jest
        .spyOn(prismaService.user, 'findMany')
        .mockRejectedValue(new Error('db error'));

      await expect(userRepository.findMany()).rejects.toThrowError(
        UserRepositoryException,
      );
    });
  });

  describe('update', () => {
    it('shouls update user successfully', async () => {
      jest
        .spyOn(prismaService.user, 'update')
        .mockResolvedValue(UserModel.fromEntity(mockUserEntity));
      const result = await userRepository.update(mockUserEntity);
      expect(result).toBeDefined();
    });

    it('should throw UserRepositoryException when prisma failed', async () => {
      jest
        .spyOn(prismaService.user, 'update')
        .mockRejectedValue(new Error('db error'));

      await expect(userRepository.update(mockUserEntity)).rejects.toThrowError(
        UserRepositoryException,
      );
    });
  });

  describe('exists', () => {
    it('should return true if user exists', async () => {
      jest
        .spyOn(prismaService.user, 'findUnique')
        .mockResolvedValue(UserModel.fromEntity(mockUserEntity));
      const result = await userRepository.exists(mockUserEntity.props.email);
      expect(result).toBeTruthy();
    });

    it('should return false if user not exists', async () => {
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);
      const result = await userRepository.exists(mockUserEntity.props.email);
      expect(result).toBeFalsy();
    });

    it('should throw UserRepositoryException when prisma failed', async () => {
      jest
        .spyOn(prismaService.user, 'findUnique')
        .mockRejectedValue(new Error('db error'));

      await expect(
        userRepository.exists(mockUserEntity.props.email),
      ).rejects.toThrowError(UserRepositoryException);
    });
  });
});
