import { Inject } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import {
  CreateImmediateChargeOnPspInput,
  CreateImmediateChargeOnPSPResponse,
  IPspService,
} from '@app/contracts';
import { CreateChargeException } from '@app/exceptions';
import { PspService } from '@app/services';

import { IEventEmitter, IUseCase } from '@domain/core';
import { IChargeRepository } from '@domain/core/repository';
import { ChargeEntity } from '@domain/entities';
import { BaseException } from '@domain/exceptions';
import { QrCode64 } from '@domain/value-objects';

import { ChargeRepository } from '@infra/prisma';

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
    @Inject(EventEmitter2)
    private readonly eventEmitter: IEventEmitter,
    @Inject(ChargeRepository)
    private readonly chargeRepository: IChargeRepository,
  ) {}
  async execute(data: CreateImmediateChargeOnPspInput) {
    const pspResult = await this.pspSerivce
      .createImmediateCharge(data)
      .catch((e) => {
        if (e instanceof BaseException) throw e;
        throw new CreateChargeException(e.message, e);
      });

    const qrCode = await QrCode64.base64(pspResult.emv);

    const charge = ChargeEntity.create({
      amount: data.amount,
      emv: pspResult.emv,
      provider: 'CELCOIN',
      providerId: pspResult.transactionId,
      status: 'ACTIVE',
      qrCode: qrCode.value,
    });

    await this.chargeRepository.save(charge);
    await Promise.all(
      charge.domainEvents.map((e) => {
        return this.eventEmitter.emitAsync(e.constructor.name, e);
      }),
    );

    return { ...pspResult, qrCode: qrCode.value };
  }
}
