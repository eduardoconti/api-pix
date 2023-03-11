import { CreateImmediateChargeOnPspInput, IPspService } from '@app/contracts';
import { CreateChargeException } from '@app/exceptions';

import { IEventEmitter, IUseCase } from '@domain/core';
import { IChargeRepository } from '@domain/core/repository';
import { ChargeEntity, ChargeProviderEnum } from '@domain/entities';
import { BaseException } from '@domain/exceptions';

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
    private readonly pspSerivce: IPspService,
    private readonly eventEmitter: IEventEmitter,
    private readonly chargeRepository: IChargeRepository,
  ) {}
  async execute({
    amount,
    calendar,
    debtor,
    merchant,
  }: CreateImmediateChargeOnPspInput) {
    const charge = ChargeEntity.create({
      amount: amount,
      provider: ChargeProviderEnum.CELCOIN,
    });

    await this.chargeRepository.save(charge);
    const pspResult = await this.pspSerivce
      .createImmediateCharge({
        amount,
        calendar,
        debtor,
        merchant,
      })
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
    charge.clearEvents();

    return {
      ...pspResult,
      qrCode: charge.qrCodeValue,
      transactionId: charge.id.value,
    };
  }
}
