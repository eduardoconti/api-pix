import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';

import { RegisterUserInput } from '@app/use-cases';

import { RegisterUserWebhookHostRequest } from './register-user-webhook-host.input.dto';

export class RegisterUserRequest {
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  @ApiProperty({
    example: 'Eduardo Conti',
  })
  name!: string;

  @MinLength(2)
  @MaxLength(255)
  @ApiProperty({
    example: 'teste@123',
  })
  @IsString()
  password!: string;

  @ApiProperty({
    example: 'es.eduardoconti@gmail.com',
  })
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  email!: string;

  @ValidateNested({
    each: true,
  })
  @Type(() => RegisterUserWebhookHostRequest)
  @IsOptional()
  @ArrayMinSize(1)
  @ApiPropertyOptional({
    isArray: true,
    type: RegisterUserWebhookHostRequest,
  })
  webhook_host?: RegisterUserWebhookHostRequest[];

  static toUseCaseInput({
    name,
    email,
    password,
    webhook_host,
  }: RegisterUserRequest): RegisterUserInput {
    return {
      email,
      password,
      name,
      webhookHost: webhook_host,
    };
  }
}
