export type CelcoinAuthResponse = {
  access_token: string;
  expires_in: number;
  token_type: string;
};

export type CelcoinLocationRequest = {
  clientRequestId: string;
  type: 'COB';
  merchant: {
    postalCode: string;
    city: string;
    merchantCategoryCode: string;
    name: string;
  };
};

export type CelcoinLocationResponse = {
  status: string;
  clientRequestId: string;
  merchant: {
    postalCode: string;
    city: string;
    merchantCategoryCode: string;
    name: string;
  };
  url: string;
  emv: string;
  type: 'COB';
  locationId: number;
};

export type CelcoinImmediateChargeRequest = {
  clientRequestId?: string;
  payerQuestion?: string;
  key: string;
  locationId: number;
  debtor: {
    name: string;
    cnpj?: string;
    cpf?: string;
  };
  amount: {
    original: string;
    changeType?: number;
  };
  calendar?: {
    expiration: number;
  };
  additionalInformation?: {
    value: string;
    key: string;
  }[];
};

export type CelcoinImmediateChargeResponse = {
  revision: number;
  transactionId: number;
  clientRequestId?: string;
  status: string;
  lastUpdate: string;
  payerQuestion?: string;
  additionalInformation?: string;
  debtor: {
    name: string;
    cpf: number;
    cnpj: string;
  };
  amount: {
    original: string;
    changeType: number;
    withdrawal?: string;
    change?: string;
  };
  location: {
    merchant: {
      postalCode: string;
      city: string;
      merchantCategoryCode: string;
      name: string;
    };
    url: string;
    emv: string;
    type: 'COB';
    locationId: string;
    id?: string;
  };
  key: string;
  calendar: {
    expiration: number;
  };
  createAt: string;
  transactionIdentification: string;
};

export type CelcoinAuth = {
  token: string;
};

export type CelcoinErrorResponse = {
  message?: string;
  errorCode?: string;
};
