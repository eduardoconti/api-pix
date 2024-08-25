import { randomUUID } from 'crypto';

import {
  CreateImmediateChargePspInput,
  CreateImmediateChargePSPOutput,
} from '@app/contracts';

import { ICelcoinApi } from '@infra/celcoin';

export class CelcoinService {
  constructor(private readonly celcoin: ICelcoinApi) {}

  async createImmediateCharge({
    merchant,
    debtor,
    amount,
    calendar,
  }: CreateImmediateChargePspInput): Promise<CreateImmediateChargePSPOutput> {
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
