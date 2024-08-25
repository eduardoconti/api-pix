export type AuthenticatePSPOutput = {
  accessToken: string;
  expiresIn: number;
};

export type CreateLocationPSPOutput = {
  locationId: number;
  status: string;
  emv: string;
  clientRequestId: string;
};

export type CreateImmediateChargePSPOutput = {
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

export type CreateImmediateChargePspInput = {
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
