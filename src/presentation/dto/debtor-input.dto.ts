import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class DebtorInput {
  @ApiProperty({
    example: 'Eduardo Ferreira Conti',
  })
  @IsString()
  name!: string;
  @ApiProperty({
    example: '50673646459',
  })
  @IsString()
  @IsOptional()
  cpf!: string;

  @IsString()
  @IsOptional()
  cnpj!: string;
}
