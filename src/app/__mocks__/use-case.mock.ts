import {
  CreateImmediateChargeUseCaseInput,
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

export const mockCreateImmediateChargeUseCaseInput: CreateImmediateChargeUseCaseInput =
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
