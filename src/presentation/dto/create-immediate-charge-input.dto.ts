import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmptyObject,
  IsOptional,
  IsPositive,
  ValidateNested,
} from 'class-validator';

import { CreateImmediateChargeUseCaseInput } from '@app/use-cases';

import { DebtorInputProperty } from '@presentation/__docs__/properties';

import { DebtorInput } from './debtor-input.dto';
import { MerchantInput } from './merchant-input.dto';

const DEFAULT_EXPIRATION = 86400; //1day
export class CreateImmediateChargeInput {
  @DebtorInputProperty()
  @ValidateNested()
  @Type(() => DebtorInput)
  @IsNotEmptyObject()
  debtor!: DebtorInput;

  @ApiProperty({
    example: 8000,
    description: 'valor em centavos.',
  })
  @IsInt()
  @IsPositive()
  amount!: number;

  @ApiProperty()
  @ValidateNested()
  @Type(() => MerchantInput)
  @IsNotEmptyObject()
  merchant!: MerchantInput;

  @ApiPropertyOptional({
    default: 86400,
    description: 'valor em segundos.',
  })
  @IsInt()
  @IsOptional()
  expiration?: number;

  static mapToUseCaseInput(
    input: CreateImmediateChargeInput & { userId: string },
  ): CreateImmediateChargeUseCaseInput {
    const {
      debtor,
      amount,
      expiration,
      merchant: { postal_code, city, category_code = '0000', name },
      userId,
    } = input;
    return {
      debtor,
      amount,
      calendar: {
        expiration: expiration ?? DEFAULT_EXPIRATION,
      },
      userId,
      merchant: {
        city: city,
        name: name,
        postalCode: postal_code,
        merchantCategoryCode: category_code,
      },
    };
  }
}
