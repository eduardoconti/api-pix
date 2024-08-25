import {
  CreateImmediateChargeInput,
  RegisterUserInput,
  RegisterUserOutput,
  AuthenticateInput,
} from '@app/use-cases';

export const mockRegisterUserUseCaseInput: RegisterUserInput = {
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

export const mockRegisterUserWithoutHostUseCaseInput: RegisterUserInput = {
  name: 'Eduardo Conti',
  email: 'eduardo.conti@gmail.com',
  password: 'teste@123',
  webhookHost: undefined,
};

export const mockRegisterUserUseCaseOutput: RegisterUserOutput = {
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

export const mockCreateImmediateChargeUseCaseInput: CreateImmediateChargeInput =
  {
    debtor: {
      name: 'Eduardo Ferreira Conti',
      cpf: '50673646459',
    },
    amount: 810,
    merchant: {
      postalCode: '86990000',
      city: 'Marialva',
      name: 'Eduardo Dev',
    },
    calendar: {
      expiration: 3600,
    },
    userId: 'b85381d7-174f-4c0a-a2c8-aa93a399965d',
  };

export const mockUserAuthUseCaseInput: AuthenticateInput = {
  userName: 'eduardo.conti@gmail.com',
  password: 'teste@123',
};
