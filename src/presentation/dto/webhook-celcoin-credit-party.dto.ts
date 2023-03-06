import { ApiProperty } from '@nestjs/swagger';

export class WebhookCelcoinCreditParty {
  @ApiProperty({
    example: '18236120',
  })
  Bank!: string;

  @ApiProperty({
    example: '1',
  })
  Branch!: string;

  @ApiProperty({
    example: '416781236',
  })
  Account!: string;

  @ApiProperty({
    example: 'NATURAL_PERSON',
  })
  PersonType!: 'NATURAL_PERSON';

  @ApiProperty({
    example: '01234567890',
  })
  TaxId!: string;

  @ApiProperty({
    example: 'CACC',
  })
  AccountType!: string;

  @ApiProperty({
    example: 'Eduardo Conti',
  })
  Name!: string;

  @ApiProperty({
    example: '8ea152b1-ddee-ssaa-aass-ce98245349aa',
  })
  Key!: string;
}
