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
    const { accessToken } = await this.celcoin.auth();
    const { locationId } = await this.celcoin.createLocation(
      {
        token: accessToken,
      },
      {
        merchant: { ...merchant, merchantCategoryCode: '0000' },
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
      },
    );

    return pspResult;
  }
}
