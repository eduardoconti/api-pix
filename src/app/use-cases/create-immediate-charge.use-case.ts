import { Inject } from '@nestjs/common';

import {
  CreateImmediateChargeOnPspInput,
  CreateImmediateChargeOnPSPResponse,
  IPspService,
} from '@app/contracts';
import { PspService } from '@app/services';

import { IUseCase } from '@domain/core';

export type ICreateImmediateChargeUseCase = IUseCase<
  CreateImmediateChargeOnPspInput,
  CreateImmediateChargeOnPSPResponse
>;
export class CreateImmediateChargeUseCase
  implements ICreateImmediateChargeUseCase
{
  constructor(
    @Inject(PspService)
    private readonly pspSerivce: IPspService,
  ) {}
  async execute(data: CreateImmediateChargeOnPspInput) {
    return await this.pspSerivce.createImmediateCharge(data);
  }
}
