import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AmountOutput {
  @ApiProperty()
  original!: number;
  @ApiPropertyOptional()
  change_type?: number;
}
