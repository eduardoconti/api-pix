import { ApiProperty } from '@nestjs/swagger';

export class MerchantOutput {
  @ApiProperty()
  postal_code!: string;
  @ApiProperty()
  city!: string;
  @ApiProperty()
  name!: string;
  @ApiProperty()
  category_code?: string;
}
