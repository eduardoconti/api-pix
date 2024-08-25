import {
  AuthenticatePSPOutput,
  CreateImmediateChargePspInput,
  CreateImmediateChargePSPOutput,
  CreateLocationPSPOutput,
} from '@app/contracts';

export const mockAuthenticateOnPSPResponse: AuthenticatePSPOutput = {
  accessToken:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGllbnRfaWQiOiI0MWI0NGFiOWE1NjQ0MC50ZXN0ZS5jZWxjb2luYXBpLnY1IiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZSI6InRlc3RlIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy91c2VyZGF0YSI6IjhlODJjOTRiN2NhZDRiMDNiNjEzIiwiZXhwIjoxNjc3ODEwNTY0LCJpc3MiOiJDZWxjb2luQVBJIiwiYXVkIjoiQ2VsY29pbkFQSSJ9.Rt3L8hsA_MbClw4Xwd8LZqtfn-O9oK6gK8BNR7Wkc9E',
  expiresIn: 86400,
};
export const mockCreateImmediateChargeOnPSPResponse: CreateImmediateChargePSPOutput =
  {
    providerTransactionId: '817401748',
    status: 'ACTIVE',
    lastUpdate: '2023-02-27T10:52:49.6804856+00:00',
    emv: '00020101021226930014br.gov.bcb.pix2571api-h.developer.btgpactual.com/v1/p/v2/4dc211df499941e08d6c18c16344eb495204000053039865802BR5910Gazin Tech6008Marialva61088699000062070503***63041229',
    amount: 810,
    merchant: {
      postalCode: '01201005',
      city: 'Barueri',
      merchantCategoryCode: '0000',
      name: 'Celcoin Pagamentos',
    },
    url: 'api-h.developer.btgpactual.com/v1/p/v2/b8bafcee036943a4b490fe94eea0744e',
    type: 'COB',
    locationId: '12867694',
    id: undefined,
    calendar: {
      expiration: 3600,
    },
    createAt: '2023-02-27T10:52:49.6804856+00:00',
  };

export const mockCreateLocationOnPSPResponse: CreateLocationPSPOutput = {
  clientRequestId: '',
  emv: '00020101021226930014br.gov.bcb.pix2571api-h.developer.btgpactual.com/v1/p/v2/b8bafcee036943a4b490fe94eea0744e5204000053039865802BR5918Celcoin Pagamentos6007Barueri61080120100562070503***63045DB2',
  locationId: 12867694,
  status: 'CREATED',
};
export const mockCreateImmediateChargeOnPspInput: CreateImmediateChargePspInput =
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
  };
