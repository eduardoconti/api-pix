import { ApiProperty } from '@nestjs/swagger';

export class CalendarOutput {
  @ApiProperty({
    example: 3600,
  })
  expiration!: number;
}
