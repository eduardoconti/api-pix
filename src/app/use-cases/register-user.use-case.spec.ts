import { Test, TestingModule } from '@nestjs/testing';

import { mockRegisterUserUseCaseInput } from '@app/__mocks__';
import { provideRegisterUserUseCase } from '@app/app.provider';
import { UserAlreadyExistsException } from '@app/exceptions';

import { userEntityMock } from '@domain/__mocks__';
import { IUserRepository } from '@domain/core';

import { UserRepository } from '@infra/prisma';

import {
  IRegisterUserUseCase,
  RegisterUserUseCase,
} from './register-user.use-case';

describe('RegisterUserUseCase', () => {
  let registerUserUseCase: IRegisterUserUseCase;
  let userRepository: IUserRepository;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        provideRegisterUserUseCase,
        {
          provide: UserRepository,
          useValue: {
            exists: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    registerUserUseCase = app.get<IRegisterUserUseCase>(RegisterUserUseCase);
    userRepository = app.get<IUserRepository>(UserRepository);
  });

  it('should defined', () => {
    expect(registerUserUseCase).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  it('should register new user successfully', async () => {
    jest.spyOn(userRepository, 'exists').mockResolvedValue(false);
    jest.spyOn(userRepository, 'save').mockResolvedValue(userEntityMock);
    const result = await registerUserUseCase.execute(
      mockRegisterUserUseCaseInput,
    );
    expect(result).toBeDefined();
  });

  it('should throw UserAlreadyExistsException', async () => {
    jest.spyOn(userRepository, 'exists').mockResolvedValue(true);
    await expect(
      registerUserUseCase.execute(mockRegisterUserUseCaseInput),
    ).rejects.toThrowError(UserAlreadyExistsException);
    expect(userRepository.exists).toBeCalled();
    expect(userRepository.save).not.toBeCalled();
  });
});
