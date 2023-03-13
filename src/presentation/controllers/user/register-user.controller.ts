import { Body, Controller, HttpStatus, Inject, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { IRegisterUserUseCase, RegisterUserUseCase } from '@app/use-cases';

import {
  ApiInternalServerErrorResponse,
  ApiSuccessResponse,
} from '@presentation/__docs__';
import { RegisterUserInput } from '@presentation/dto';
import { RegisterUserOutput } from '@presentation/dto/register-user.output.dto';

@ApiTags('user')
@Controller('user')
export class RegisterUserController {
  constructor(
    @Inject(RegisterUserUseCase)
    private readonly registerUserUseCase: IRegisterUserUseCase,
  ) {}

  @Post('')
  @ApiOperation({
    summary: 'Registra novo usuáro',
    description: 'Rota para registrar um novo usuário',
  })
  @ApiSuccessResponse({
    model: RegisterUserOutput,
    statusCode: HttpStatus.CREATED,
  })
  @ApiInternalServerErrorResponse({
    title: 'UserRepositoryException',
    detail: 'database error',
  })
  async handle(@Body() data: RegisterUserInput): Promise<RegisterUserOutput> {
    const { email, name, webhookHost, id } =
      await this.registerUserUseCase.execute(
        RegisterUserInput.toUseCaseInput(data),
      );

    return { id, email, name, webhook_host: webhookHost };
  }
}
