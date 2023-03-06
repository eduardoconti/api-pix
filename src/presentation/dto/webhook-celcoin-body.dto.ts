import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, ValidateNested } from 'class-validator';

import { WebhookCelcoinCreditParty } from './webhook-celcoin-credit-party.dto';
import { WebhookCelcoinDebitParty } from './webhook-celcoin-debit-party.dto';

export class WebhookCelcoinBody {
  @IsString()
  @ApiProperty({
    example: 'RECEIVEPIX',
  })
  TransactionType!: 'RECEIVEPIX';

  @IsNumber()
  @ApiProperty({
    example: 56762766,
  })
  TransactionId!: number;

  @IsNumber()
  @ApiProperty({
    example: 150.55,
  })
  Amount!: number;

  @ValidateNested()
  @ApiProperty()
  DebitParty!: WebhookCelcoinDebitParty;

  @ValidateNested()
  @ApiProperty()
  CreditParty!: WebhookCelcoinCreditParty;

  @IsString()
  @ApiProperty({
    example: 'E18236120202001199999s0149012FPC',
  })
  EndToEndId!: string;

  @IsString()
  @ApiProperty({
    example: 'kk6g232xel65a0daee4dd13kk54578675',
  })
  transactionIdentification!: string;

  @IsString()
  @ApiProperty({
    example: '54578675',
  })
  transactionIdBRCode!: string;
}
