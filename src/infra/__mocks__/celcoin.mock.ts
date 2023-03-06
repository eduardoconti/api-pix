import {
  CelcoinErrorResponse,
  CelcoinImmediateChargeRequest,
} from '@infra/celcoin/contracts';

import { WebhookCelcoinInput } from '@presentation/dto';

export const mockCelcoinAuthResponse = {
  access_token:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGllbnRfaWQiOiI0MWI0NGFiOWE1NjQ0MC50ZXN0ZS5jZWxjb2luYXBpLnY1IiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZSI6InRlc3RlIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy91c2VyZGF0YSI6ImQ3MzY1MGZjZjg3ZDQ4MmU5ODE1IiwiZXhwIjoxNjc3NjA1MDU1LCJpc3MiOiJDZWxjb2luQVBJIiwiYXVkIjoiQ2VsY29pbkFQSSJ9.fZD6cTjh9UdqUtCRS3RItqAo4NtSpQZb34q5-jcRcQw',
  expires_in: 2400,
  token_type: 'bearer',
};

export const mockCelcoinLocationResponse = {
  status: 'CREATED',
  clientRequestId: '0O_qAe1at3466fe9H1Fid',
  merchant: {
    postalCode: '86990000',
    city: 'Marialva',
    merchantCategoryCode: '0000',
    name: 'Eduardo Dev',
  },
  url: 'api-h.developer.btgpactual.com/v1/p/v2/2979dd7a018c485eb84fffbde0e8e36e',
  emv: '00020101021226930014br.gov.bcb.pix2571api-h.developer.btgpactual.com/v1/p/v2/2979dd7a018c485eb84fffbde0e8e36e5204000053039865802BR5910Eduardo Dev6008Marialva61088699000062070503***6304CD0C',
  type: 'COB',
  locationId: 12868185,
};

export const mockCelcoinImmediateChargeResponse = {
  revision: 0,
  transactionId: 817406091,
  clientRequestId: null,
  status: 'ACTIVE',
  lastUpdate: '2023-02-28T16:49:19.0334619+00:00',
  payerQuestion: null,
  additionalInformation: null,
  debtor: { name: 'Eduardo Ferreira Conti', cpf: '50673646459', cnpj: null },
  amount: { original: 80, changeType: 0, withdrawal: null, change: null },
  location: {
    merchant: {
      postalCode: '86990000',
      city: 'Marialva',
      merchantCategoryCode: '0000',
      name: 'Eduardo Dev',
    },
    url: 'api-h.developer.btgpactual.com/v1/p/v2/5716063d3bd4498393b3b5001d4ca5ea',
    emv: '00020101021226930014br.gov.bcb.pix2571api-h.developer.btgpactual.com/v1/p/v2/5716063d3bd4498393b3b5001d4ca5ea5204000053039865802BR5910Eduardo Dev6008Marialva61088699000062070503***6304B538',
    type: 'COB',
    locationId: '12868186',
    id: null,
  },
  key: 'testepix@celcoin.com.br',
  calendar: { expiration: 86400 },
  createAt: '2023-02-28T16:49:19.0334619+00:00',
  transactionIdentification: 'kk6g232xel65a0daee4dd13kk817406091',
};

export const mockCreateLocationOnCelcoinRequest = {
  merchant: {
    postalCode: '86990000',
    city: 'Marialva',
    merchantCategoryCode: '0000',
    name: 'Eduardo Dev',
  },
};

export const mockCelcoinImmediateChargeRequest: Omit<
  CelcoinImmediateChargeRequest,
  'amount'
> & { amount: number } = {
  amount: 810,
  key: 'testepix@celcoin.com.br',
  debtor: { name: 'Eduardo Ferreira Conti', cnpj: '50673646459123' },
  calendar: { expiration: 86400 },
  locationId: 12868841,
};

export const mockCelcoinAuth = {
  token:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGllbnRfaWQiOiI0MWI0NGFiOWE1NjQ0MC50ZXN0ZS5jZWxjb2luYXBpLnY1IiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZSI6InRlc3RlIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy91c2VyZGF0YSI6ImQ3MzY1MGZjZjg3ZDQ4MmU5ODE1IiwiZXhwIjoxNjc3NjA1MDU1LCJpc3MiOiJDZWxjb2luQVBJIiwiYXVkIjoiQ2VsY29pbkFQSSJ9.fZD6cTjh9UdqUtCRS3RItqAo4NtSpQZb34q5-jcRcQw',
};

export const mockCelcoinErrorResponse: CelcoinErrorResponse = {
  errorCode: '012545',
  message: 'any error',
};

export const mockCelcoinWebhook: WebhookCelcoinInput = {
  RequestBody: {
    TransactionType: 'RECEIVEPIX',
    TransactionId: 56762766,
    Amount: 150.55,
    DebitParty: {
      Account: '416781236',
      Bank: '18236120',
      Branch: '1',
      PersonType: 'NATURAL_PERSON',
      TaxId: '01234567890',
      AccountType: 'CACC',
      Name: 'Fulano de Tal',
    },
    CreditParty: {
      Bank: '13935893',
      Branch: '1',
      Account: '123456789',
      PersonType: 'NATURAL_PERSON',
      TaxId: '09876543210',
      AccountType: 'CACC',
      Name: 'Cicrano de Outro',
      Key: '8ea152b1-ddee-ssaa-aass-ce98245349aa',
    },
    EndToEndId: 'E18236120202001199999s0149012FPC',
    transactionIdentification: 'kk6g232xel65a0daee4dd13kk54578675',
    transactionIdBRCode: '54578675',
  },
};
