import { Inject, Injectable } from '@nestjs/common';

import {
  CreateImmediateChargeOnPspInput,
  CreateImmediateChargeOnPSPResponse,
  IPspService,
} from '@app/contracts';

import { CelcoinApi } from '@infra/celcoin';

@Injectable()
export class PspService implements IPspService {
  constructor(
    @Inject(CelcoinApi)
    private readonly celcoin: CelcoinApi,
  ) {}

  async createImmediateCharge(
    data: CreateImmediateChargeOnPspInput,
  ): Promise<CreateImmediateChargeOnPSPResponse> {
    const { merchant, key, debtor, amount, calendar } = data;

    const { accessToken } = await this.celcoin.auth();
    const { locationId } = await this.celcoin.createLocation(
      {
        token: accessToken,
      },
      {
        merchant: { ...merchant, merchantCategoryCode: '0000' },
      },
    );

    return await this.celcoin.createImmediateCharge(
      {
        token: accessToken,
      },
      {
        locationId,
        key,
        debtor,
        amount,
        calendar,
      },
    );
  }
}
