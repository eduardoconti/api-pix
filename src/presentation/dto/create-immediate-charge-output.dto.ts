import { ApiProperty } from '@nestjs/swagger';

import { CreateImmediateChargeOutput } from '@app/use-cases';

export class CreateImmediateChargeResponse {
  @ApiProperty({
    example: '8883c972-059e-4ad6-998d-241c333757bc',
  })
  transaction_id!: string;

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
    example:
      'data:image/png;base64,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',
  })
  qr_code!: string;
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
    useCaseOutput: CreateImmediateChargeOutput,
  ): CreateImmediateChargeResponse {
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
      qrCode,
      providerTransactionId,
    } = useCaseOutput;

    return {
      transaction_id: transactionId,
      psp_transaction_id: providerTransactionId,
      status,
      amount,
      expiration: Date.now() + expiration * 1000,
      emv,
      qr_code: qrCode,
      location_id: locationId,
      url,
      last_update: lastUpdate,
      created_at: createAt,
    };
  }
}
