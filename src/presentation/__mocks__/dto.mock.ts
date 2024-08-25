import { TokenPayload } from '@app/contracts';

import {
  CreateImmediateChargeRequest,
  RegisterUserRequest,
} from '@presentation/dto';

export const mockCreateImmediateChargeInput: CreateImmediateChargeRequest = {
  debtor: {
    name: 'Eduardo Ferreira Conti',
    cpf: '50673646459',
    cnpj: '50673646459025',
  },
  amount: 811,
  merchant: {
    postal_code: '86990000',
    city: 'Marialva',
    name: 'Eduardo Dev',
  },
  expiration: 3600,
};

export const mockRegisterUserInput: RegisterUserRequest = {
  name: 'Eduardo Ferreira Conti',
  email: 'es.eduardoconti@gmail.com',
  password: 'teste@123',
  webhook_host: [
    {
      type: 'CHARGE_PAYED',
      host: 'http://localhost:3000/pix',
    },
  ],
};

export const mockRegisterUserInputRequiredFields: RegisterUserRequest = {
  name: 'Eduardo Ferreira Conti',
  email: 'es.eduardoconti@gmail.com',
  password: 'teste@123',
};

export const mockTokenPayload: TokenPayload = {
  userId: 'b85381d7-174f-4c0a-a2c8-aa93a399965d',
  userName: 'es.eduardoconti@gmail.com',
};
