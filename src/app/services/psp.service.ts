import { randomUUID } from 'crypto';

import {
  CreateImmediateChargeOnPspInput,
  CreateImmediateChargeOnPSPResponse,
  IPspService,
} from '@app/contracts';

import { ICelcoinApi } from '@infra/celcoin';

export class PspService implements IPspService {
  constructor(private readonly celcoin: ICelcoinApi) {}

  async createImmediateCharge({
    merchant,
    debtor,
    amount,
    calendar,
  }: CreateImmediateChargeOnPspInput): Promise<CreateImmediateChargeOnPSPResponse> {
    const clientRequestId = randomUUID();
    const { accessToken } = await this.celcoin.auth();
    const { locationId } = await this.celcoin.createLocation(
      {
        token: accessToken,
      },
      {
        clientRequestId,
        merchant: {
          ...merchant,
          merchantCategoryCode: '0000',
        },
      },
    );

    const pspResult = await this.celcoin.createImmediateCharge(
      {
        token: accessToken,
      },
      {
        locationId,
        debtor,
        amount,
        calendar,
        clientRequestId,
      },
    );

    return pspResult;
  }
}
