import {
  CreateImmediateChargePSPOutput,
  CreateImmediateChargePspInput,
} from '@app/contracts';
import { CreateChargeException } from '@app/exceptions';
import { CelcoinService } from '@app/services';

import { IEventEmitter, IUseCase } from '@domain/core';
import { IChargeRepository } from '@domain/core/repository';
import { ChargeEntity, ChargeProviderEnum } from '@domain/entities';
import { BaseException } from '@domain/exceptions';

export type CreateImmediateChargeOutput = {
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

export type CreateImmediateChargeInput = CreateImmediateChargePspInput & {
  userId: string;
};

export type ICreateImmediateChargeUseCase = IUseCase<
  CreateImmediateChargeInput,
  CreateImmediateChargeOutput
> & {
  setStrategy(pspStrategy: IImmediateChargeCreatorStrategy): void;
};

export type IImmediateChargeCreatorStrategy = {
  createChargeEntity(input: CreateImmediateChargeInput): ChargeEntity;
  createImmediateCharge(input: CreateImmediateChargeInput): Promise<{
    error?: Error;
    data: CreateImmediateChargePSPOutput;
  }>;
};
export class CreateImmediateCharge implements ICreateImmediateChargeUseCase {
  constructor(
    private readonly eventEmitter: IEventEmitter,
    private readonly chargeRepository: IChargeRepository,
  ) {}

  private pspStrategy!: IImmediateChargeCreatorStrategy;

  setStrategy(pspStrategy: IImmediateChargeCreatorStrategy): void {
    this.pspStrategy = pspStrategy;
  }

  async execute(input: CreateImmediateChargeInput) {
    const charge = this.pspStrategy.createChargeEntity(input);

    await this.chargeRepository.save(charge);

    const { data: pspResult, error } =
      await this.pspStrategy.createImmediateCharge(input);

    if (error) {
      charge.markAsFailed();
      await this.chargeRepository.update(charge);
      if (error instanceof BaseException) throw error;
      throw new CreateChargeException(error.message, error);
    }

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

export class CelcoinImmediateChargeCreator
  implements IImmediateChargeCreatorStrategy
{
  constructor(private readonly celcoinService: CelcoinService) {}

  createChargeEntity({
    amount,
    userId,
  }: CreateImmediateChargeInput): ChargeEntity {
    return ChargeEntity.create({
      amount: amount,
      provider: ChargeProviderEnum.CELCOIN,
      userId,
    });
  }

  async createImmediateCharge({
    amount,
    calendar,
    debtor,
    merchant,
  }: CreateImmediateChargeInput): Promise<{
    error?: Error | undefined;
    data: CreateImmediateChargePSPOutput;
  }> {
    try {
      const pspResult = await this.celcoinService.createImmediateCharge({
        amount,
        calendar,
        debtor,
        merchant,
      });

      return {
        data: pspResult,
      };
    } catch (error) {
      return { error: error as Error, data: {} as any };
    }
  }
}
