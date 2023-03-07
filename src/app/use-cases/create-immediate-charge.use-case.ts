import { Inject } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { CreateImmediateChargeOnPspInput, IPspService } from '@app/contracts';
import { CreateChargeException } from '@app/exceptions';
import { PspService } from '@app/services';

import { IEventEmitter, IUseCase } from '@domain/core';
import { IChargeRepository } from '@domain/core/repository';
import { ChargeEntity } from '@domain/entities';
import { BaseException } from '@domain/exceptions';

import { ChargeRepository } from '@infra/prisma';

export type CreateImmediateChargeUseCaseOutput = {
  transactionId: string;
  providerTransactionId: string;
  status: string;
  amount: number;
  url: string;
  locationId: string;
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
  qrCode: string;
  emv: string;
};

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
    const charge = ChargeEntity.create({
      amount: data.amount,
      provider: 'CELCOIN',
    });

    await this.chargeRepository.save(charge);
    const pspResult = await this.pspSerivce
      .createImmediateCharge(data)
      .catch(async (e) => {
        charge.markAsFailed();
        await this.chargeRepository.update(charge);
        if (e instanceof BaseException) throw e;
        throw new CreateChargeException(e.message, e);
      });

    await charge.completeWithPSPResponse({
      emv: pspResult.emv,
      providerId: pspResult.providerTransactionId,
    });
    await this.chargeRepository.update(charge);
    await Promise.all(
      charge.domainEvents.map((e) => {
        return this.eventEmitter.emitAsync(e.constructor.name, e);
      }),
    );

    return {
      ...pspResult,
      qrCode: charge.props?.qrCode?.value as string,
      transactionId: charge.id.value,
    };
  }
}
