import { Test, TestingModule } from '@nestjs/testing';

import {
  mockRegisterUserUseCaseInput,
  mockRegisterUserWithoutHostUseCaseInput,
} from '@app/__mocks__';
import { provideRegisterUserUseCase } from '@app/app.provider';
import { UserAlreadyExistsException } from '@app/exceptions';

import { mockUserEntity, mockUserEntityWithoutHost } from '@domain/__mocks__';
import { IUserRepository } from '@domain/core';
import { ArgumentInvalidException } from '@domain/exceptions';

import { UserRepositoryMongo } from '@infra/database/mongo';

import { IRegisterUserUseCase, RegisterUser } from './register-user.use-case';

describe('RegisterUserUseCase', () => {
  let registerUserUseCase: IRegisterUserUseCase;
  let userRepository: IUserRepository;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        provideRegisterUserUseCase,
        {
          provide: UserRepositoryMongo,
          useValue: {
            exists: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    registerUserUseCase = app.get<IRegisterUserUseCase>(RegisterUser);
    userRepository = app.get<IUserRepository>(UserRepositoryMongo);
  });

  it('should defined', () => {
    expect(registerUserUseCase).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  it('should register new user successfully', async () => {
    jest.spyOn(userRepository, 'exists').mockResolvedValue(false);
    jest.spyOn(userRepository, 'save').mockResolvedValue(mockUserEntity);
    const result = await registerUserUseCase.execute(
      mockRegisterUserUseCaseInput,
    );
    expect(result).toBeDefined();
  });

  it('should register new user without hosts successfully', async () => {
    jest.spyOn(userRepository, 'exists').mockResolvedValue(false);
    jest
      .spyOn(userRepository, 'save')
      .mockResolvedValue(mockUserEntityWithoutHost);
    const result = await registerUserUseCase.execute(
      mockRegisterUserWithoutHostUseCaseInput,
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

  it('should throw ArgumentInvalidException when duplicated webhook type', async () => {
    jest.spyOn(userRepository, 'exists').mockResolvedValue(false);
    await expect(
      registerUserUseCase.execute({
        ...mockRegisterUserUseCaseInput,
        webhookHost: [
          {
            type: 'CHARGE_PAYED',
            host: 'http://localhost:3000/pix',
          },
          {
            type: 'CHARGE_PAYED',
            host: 'http://localhost:3000/pix',
          },
        ],
      }),
    ).rejects.toThrowError(
      new ArgumentInvalidException(`duplicated webhook type CHARGE_PAYED`),
    );
    expect(userRepository.exists).toBeCalled();
    expect(userRepository.save).not.toBeCalled();
  });
});
