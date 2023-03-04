import { Inject } from '@nestjs/common';

import {
  CreateImmediateChargeOnPspInput,
  CreateImmediateChargeOnPSPResponse,
  IPspService,
} from '@app/contracts';
import { CreateChargeException } from '@app/exceptions';
import { PspService } from '@app/services';

import { IUseCase } from '@domain/core';
import { BaseException } from '@domain/exceptions';
import { QrCode64 } from '@domain/value-objects';

export type CreateImmediateChargeUseCaseOutput =
  CreateImmediateChargeOnPSPResponse & { qrCode: string; emv: string };

export type ICreateImmediateChargeUseCase = IUseCase<
  CreateImmediateChargeOnPspInput,
  CreateImmediateChargeUseCaseOutput
>;
export class CreateImmediateChargeUseCase
  implements ICreateImmediateChargeUseCase
{
  constructor(
    @Inject(PspService)
    private readonly pspSerivce: IPspService,
  ) {}
  async execute(data: CreateImmediateChargeOnPspInput) {
    const pspResult = await this.pspSerivce
      .createImmediateCharge(data)
      .catch((e) => {
        if (e instanceof BaseException) throw e;
        throw new CreateChargeException(e.message, e);
      });

    const qrCode = await QrCode64.base64(pspResult.emv);
    return { ...pspResult, qrCode: qrCode.value };
  }
}
