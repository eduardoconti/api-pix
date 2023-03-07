import { ApiProperty } from '@nestjs/swagger';
import { ValidateNested } from 'class-validator';

import { ReceiveWebhookUseCaseInput } from '@app/use-cases';

import { Amount } from '@domain/value-objects';

import { WebhookCelcoinBody } from './webhook-celcoin-body.dto';

export class WebhookCelcoinInput {
  @ValidateNested()
  @ApiProperty()
  RequestBody!: WebhookCelcoinBody;

  static toUseCaseInput(
    input: WebhookCelcoinInput,
  ): ReceiveWebhookUseCaseInput {
    const {
      RequestBody: { EndToEndId, TransactionId, Amount: amount },
    } = input;
    return {
      endToEndId: EndToEndId,
      provider: 'CELCOIN',
      providerId: TransactionId.toString(),
      type: 'CHARGE_PAYED',
      providerJson: JSON.stringify(input),
      amount: Amount.fromBrlString(amount.toFixed(2)),
    };
  }
}
