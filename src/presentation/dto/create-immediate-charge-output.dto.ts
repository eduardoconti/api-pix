import { ApiProperty } from '@nestjs/swagger';

import { CreateImmediateChargeOnPSPResponse } from '@app/contracts';

export class CreateImmediateChargeOutput {
  @ApiProperty({
    example: '817414434',
  })
  psp_transaction_id!: string;
  @ApiProperty({
    example: 'ACTIVE',
  })
  status!: string;
  @ApiProperty({
    example: 8000,
  })
  amount!: number;
  @ApiProperty({
    example: 86400,
  })
  expiration!: number;
  @ApiProperty({
    example:
      '00020101021226930014br.gov.bcb.pix2571api-h.developer.btgpactual.com/v1/p/v2/28b559ae7aec460dae8214c297532d5e5204000053039865802BR5910Eduardo Dev6008Marialva61088699000062070503***63041385',
  })
  emv!: string;
  @ApiProperty({
    example: '12868523',
  })
  location_id!: string;
  @ApiProperty({
    example:
      'api-h.developer.btgpactual.com/v1/p/v2/28b559ae7aec460dae8214c297532d5e',
  })
  url!: string;
  @ApiProperty({
    example: '2023-03-02T05:24:52.7212182+00:00',
  })
  last_update!: string;
  @ApiProperty({
    example: '2023-03-02T05:24:52.7212182+00:00',
  })
  created_at!: string;

  static mapFromUseCaseOutput(
    useCaseOutput: CreateImmediateChargeOnPSPResponse,
  ): CreateImmediateChargeOutput {
    const {
      transactionId,
      status,
      lastUpdate,
      amount,
      calendar: { expiration },
      emv,
      locationId,
      url,
      createAt,
    } = useCaseOutput;
    return {
      psp_transaction_id: transactionId,
      status,
      amount,
      expiration,
      emv,
      location_id: locationId,
      url,
      last_update: lastUpdate,
      created_at: createAt,
    };
  }
}
