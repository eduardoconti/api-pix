import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { RegisterUserOutput } from '@app/use-cases';

import { RegisterUserWebhookHostRequest } from './register-user-webhook-host.input.dto';

export class RegisterUserResponse {
  @ApiProperty({
    example: 'b85381d7-174f-4c0a-a2c8-aa93a399965d',
  })
  id!: string;

  @ApiProperty({
    example: 'Eduardo Conti',
  })
  name!: string;

  @ApiProperty({
    example: 'es.eduardoconti@gmail.com',
  })
  email!: string;

  @ApiPropertyOptional({
    isArray: true,
    type: RegisterUserWebhookHostRequest,
  })
  webhook_host?: RegisterUserWebhookHostRequest[];

  static fromUseCaseOutput({
    name,
    email,
    webhookHost,
    id,
  }: RegisterUserOutput): RegisterUserResponse {
    return {
      email,
      name,
      webhook_host: webhookHost,
      id,
    };
  }
}
