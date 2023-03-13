import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsUrl, MaxLength } from 'class-validator';

import { WebhookTypes, WebhookTypesEnum } from '@domain/entities';

export class RegisterUserWebhookHostInput {
  @IsEnum(WebhookTypesEnum)
  @ApiProperty({
    example: 'CHARGE_PAYED',
    enum: WebhookTypesEnum,
    description: 'Tipo de notificação',
  })
  type!: WebhookTypes;

  @MaxLength(255)
  @ApiProperty({
    example: 'http://localhost:3005/pix',
    description:
      'Endpoint para receber notificações de mudança do status da cobrança',
  })
  @IsUrl()
  host!: string;
}
