import { ApiProperty } from '@nestjs/swagger';
import { ValidateNested } from 'class-validator';

import { ReceiveWebhookInput } from '@app/use-cases';

import { Amount } from '@domain/value-objects';

import { WebhookCelcoinBody } from './webhook-celcoin-body.dto';

export class WebhookCelcoinRequest {
  @ValidateNested()
  @ApiProperty()
  RequestBody!: WebhookCelcoinBody;

  static toUseCaseInput(request: WebhookCelcoinRequest): ReceiveWebhookInput {
    const {
      RequestBody: { EndToEndId, TransactionId, Amount: amount },
    } = request;
    return {
      endToEndId: EndToEndId,
      provider: 'CELCOIN',
      providerId: TransactionId.toString(),
      type: 'CHARGE_PAYED',
      providerJson: JSON.stringify(request),
      amount: Amount.fromBrlString(amount.toFixed(2)),
    };
  }
}
