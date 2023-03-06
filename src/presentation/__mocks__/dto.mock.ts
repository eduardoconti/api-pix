import { CreateImmediateChargeInput } from '@presentation/dto';

export const mockCreateImmediateChargeInput: CreateImmediateChargeInput = {
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
