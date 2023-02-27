import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class MerchantInput {
  @ApiProperty({
    example: '86990000',
  })
  postal_code!: string;
  @ApiProperty({
    example: 'Marialva',
  })
  city!: string;
  @ApiProperty({
    example: 'Eduardo Dev',
  })
  name!: string;
  @ApiPropertyOptional({
    example: '0000',
  })
  category_code?: '0000';
}
