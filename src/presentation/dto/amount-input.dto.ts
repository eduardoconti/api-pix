import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AmountInput {
  @ApiProperty({
    example: 8000,
    description: 'valor em centavos.',
  })
  original!: number;
  @ApiPropertyOptional({
    example: 0,
  })
  change_type?: number;
}
