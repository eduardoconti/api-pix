import { Test, TestingModule } from '@nestjs/testing';

import { mockRegisterUserUseCaseOutput } from '@app/__mocks__';
import { IRegisterUserUseCase, RegisterUserUseCase } from '@app/use-cases';

import { mockRegisterUserInput } from '@presentation/__mocks__';

import { RegisterUserController } from './register-user.controller';

describe('RegisterUserController', () => {
  let controller: RegisterUserController;
  let registerUserUseCase: IRegisterUserUseCase;
  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [RegisterUserController],
      providers: [
        {
          provide: RegisterUserUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = app.get(RegisterUserController);
    registerUserUseCase = app.get<IRegisterUserUseCase>(RegisterUserUseCase);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(registerUserUseCase).toBeDefined();
  });

  it('should execute controller', async () => {
    jest
      .spyOn(registerUserUseCase, 'execute')
      .mockResolvedValue(mockRegisterUserUseCaseOutput);
    const result = await controller.handle(mockRegisterUserInput);
    expect(result).toStrictEqual({
      email: 'eduardo.conti@gmail.com',
      id: 'b85381d7-174f-4c0a-a2c8-aa93a399965d',
      name: 'Eduardo Conti',
      webhook_host: [
        { host: 'http://localhost:3000/pix', type: 'CHARGE_PAYED' },
      ],
    });
    expect(registerUserUseCase.execute).toBeCalled();
  });
});
