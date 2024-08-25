import { Body, Controller, HttpStatus, Inject, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { IRegisterUserUseCase, RegisterUser } from '@app/use-cases';

import {
  ApiInternalServerErrorResponse,
  ApiSuccessResponse,
} from '@presentation/__docs__';
import { RegisterUserRequest } from '@presentation/dto';
import { RegisterUserResponse } from '@presentation/dto/register-user.output.dto';

@ApiTags('user')
@Controller('user')
export class RegisterUserController {
  constructor(
    @Inject(RegisterUser)
    private readonly registerUserUseCase: IRegisterUserUseCase,
  ) {}

  @Post('')
  @ApiOperation({
    summary: 'Registra novo usuário',
    description: 'Rota para registrar um novo usuário',
  })
  @ApiSuccessResponse({
    model: RegisterUserResponse,
    statusCode: HttpStatus.CREATED,
  })
  @ApiInternalServerErrorResponse({
    title: 'UserRepositoryException',
    detail: 'database error',
  })
  async handle(
    @Body() data: RegisterUserRequest,
  ): Promise<RegisterUserResponse> {
    const { email, name, webhookHost, id } =
      await this.registerUserUseCase.execute(
        RegisterUserRequest.toUseCaseInput(data),
      );
    return { id, email, name, webhook_host: webhookHost };
  }
}
