import { Test, TestingModule } from '@nestjs/testing';

import { mockUserAuthUseCaseInput } from '@app/__mocks__';
import { provideUserAuthUseCase } from '@app/app.provider';

import { mockUserEntity } from '@domain/__mocks__';
import { IUserRepository } from '@domain/core';

import { UserRepositoryMongo } from '@infra/database/mongo';
import { UnauthorizedException } from '@infra/exceptions';

import { Authenticate, IAuthenticateUseCase } from './authenticate.use-case';

describe('AuthenticateUseCase', () => {
  let userAuthUseCase: IAuthenticateUseCase;
  let userRepository: IUserRepository;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        provideUserAuthUseCase,
        {
          provide: UserRepositoryMongo,
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    userAuthUseCase = app.get<IAuthenticateUseCase>(Authenticate);
    userRepository = app.get<IUserRepository>(UserRepositoryMongo);
  });

  it('should be defined', () => {
    expect(userAuthUseCase).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  it('should execute successfully', async () => {
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUserEntity);
    const result = await userAuthUseCase.execute(mockUserAuthUseCaseInput);
    expect(result).toBeDefined();
  });

  it('should throw UnauthorizedException when password compare hash failed', async () => {
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUserEntity);
    await expect(
      userAuthUseCase.execute({
        ...mockUserAuthUseCaseInput,
        password: 'teste!123',
      }),
    ).rejects.toThrowError(UnauthorizedException);
  });
});
