import {
  RegisterUserUseCaseInput,
  RegisterUserUseCaseOutput,
} from '@app/use-cases';

export const mockRegisterUserUseCaseInput: RegisterUserUseCaseInput = {
  name: 'Eduardo Conti',
  email: 'eduardo.conti@gmail.com',
  password: 'teste@123',
  webhookHost: [
    {
      type: 'CHARGE_PAYED',
      host: 'http://localhost:3000/pix',
    },
  ],
};

export const mockRegisterUserUseCaseOutput: RegisterUserUseCaseOutput = {
  id: 'b85381d7-174f-4c0a-a2c8-aa93a399965d',
  name: 'Eduardo Conti',
  email: 'eduardo.conti@gmail.com',
  webhookHost: [
    {
      type: 'CHARGE_PAYED',
      host: 'http://localhost:3000/pix',
    },
  ],
};
