import { ApiProperty } from '@nestjs/swagger';

export class DebtorInput {
  @ApiProperty({
    example: 'Eduardo Ferreira Conti',
  })
  name!: string;
  @ApiProperty({
    example: '50673646459',
  })
  cpf!: string;
}
