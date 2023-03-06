import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class MerchantInput {
  @MinLength(2)
  @MaxLength(255)
  @ApiProperty({
    example: '86990000',
  })
  postal_code!: string;

  @MinLength(2)
  @MaxLength(255)
  @ApiProperty({
    example: 'Marialva',
  })
  @IsString()
  city!: string;

  @ApiProperty({
    example: 'Eduardo Dev',
  })
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  name!: string;

  @ApiPropertyOptional({
    example: '0000',
  })
  @IsString()
  @IsOptional()
  @MinLength(2)
  @MaxLength(255)
  category_code?: '0000';
}
