import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { CreateImmediateChargeOnPspInput } from '@app/contracts';

import { DebtorInputProperty } from '@presentation/__docs__/properties';

import { DebtorInput } from './debtor-input.dto';
import { MerchantInput } from './merchant-input.dto';

const DEFAULT_EXPIRATION = 86400; //1day
export class CreateImmediateChargeInput {
  @ApiProperty({
    example: 'testepix@celcoin.com.br',
    description: 'chave pix.',
  })
  key!: string;
  @DebtorInputProperty()
  debtor!: DebtorInput;
  @ApiProperty({
    example: 8000,
    description: 'valor em centavos.',
  })
  amount!: number;
  @ApiProperty()
  merchant!: MerchantInput;
  @ApiPropertyOptional({
    default: 86400,
    description: 'valor em segundos.',
  })
  expiration?: number;

  static mapToUseCaseInput(
    input: CreateImmediateChargeInput,
  ): CreateImmediateChargeOnPspInput {
    const {
      key,
      debtor,
      amount,
      expiration,
      merchant: { postal_code, city, category_code = '0000', name },
    } = input;
    return {
      key,
      debtor,
      amount,
      calendar: {
        expiration: expiration ?? DEFAULT_EXPIRATION,
      },

      merchant: {
        city: city,
        name: name,
        postalCode: postal_code,
        merchantCategoryCode: category_code,
      },
    };
  }
}
