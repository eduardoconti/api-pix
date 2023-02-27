import { ApiProperty } from '@nestjs/swagger';

export class CalendarInput {
  @ApiProperty({
    example: 3600,
  })
  expiration!: number;
}
