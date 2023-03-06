export interface IAuthenticateOnPSP {
  auth(): Promise<AuthenticateOnPSPResponse>;
}

export interface ICreateLocationOnPSP<Auth, Request> {
  createLocation(
    auth: Auth,
    data: Request,
  ): Promise<CreateLocationOnPSPResponse>;
}

export interface ICreateImmediateChargeOnPSP<Auth, Request> {
  createImmediateCharge(
    auth: Auth,
    data: Request,
  ): Promise<CreateImmediateChargeOnPSPResponse>;
}

export type AuthenticateOnPSPResponse = {
  accessToken: string;
  expiresIn: number;
};

export type CreateLocationOnPSPResponse = {
  locationId: number;
  status: string;
  emv: string;
  clientRequestId: string;
};

export type CreateImmediateChargeOnPSPResponse = {
  providerTransactionId: string;
  status: string;
  amount: number;
  url: string;
  type: 'COB';
  locationId: string;
  emv: string;
  id?: string;
  merchant: {
    postalCode: string;
    city: string;
    merchantCategoryCode: string;
    name: string;
  };
  calendar: {
    expiration: number;
  };
  lastUpdate: string;
  createAt: string;
};

export interface IPspService {
  createImmediateCharge(
    data: CreateImmediateChargeOnPspInput,
  ): Promise<CreateImmediateChargeOnPSPResponse>;
}

export type CreateImmediateChargeOnPspInput = {
  debtor: {
    name: string;
    cpf: string;
    cnpj?: string;
  };
  amount: number;
  calendar: {
    expiration: number;
  };
  merchant: {
    postalCode: string;
    city: string;
    name: string;
    merchantCategoryCode?: string;
  };
};
