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

import { RegisterUserUseCaseInput } from '@app/use-cases';

import { RegisterUserWebhookHostInput } from './register-user-webhook-host.input.dto';

export class RegisterUserInput {
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
  @Type(() => RegisterUserWebhookHostInput)
  @IsOptional()
  @ArrayMinSize(1)
  @ApiPropertyOptional({
    isArray: true,
    type: RegisterUserWebhookHostInput,
  })
  webhook_host?: RegisterUserWebhookHostInput[];

  static toUseCaseInput({
    name,
    email,
    password,
    webhook_host,
  }: RegisterUserInput): RegisterUserUseCaseInput {
    return {
      email,
      password,
      name,
      webhookHost: webhook_host,
    };
  }
}
