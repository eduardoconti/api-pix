import { Body, Controller, HttpStatus, Inject, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import {
  CreateImmediateChargeUseCase,
  ICreateImmediateChargeUseCase,
} from '@app/use-cases';

import {
  ApiInternalServerErrorResponse,
  ApiServiceUnavailableErrorResponse,
  ApiSuccessResponse,
} from '@presentation/__docs__';
import {
  CreateImmediateChargeInput,
  CreateImmediateChargeOutput,
} from '@presentation/dto';
@ApiTags('charge')
@Controller('immediate-charge')
export class CreateImmediateChargeController {
  constructor(
    @Inject(CreateImmediateChargeUseCase)
    private readonly createImmediateChargeUseCase: ICreateImmediateChargeUseCase,
  ) {}
  @Post()
  @ApiSuccessResponse({
    model: CreateImmediateChargeOutput,
    statusCode: HttpStatus.CREATED,
  })
  @ApiInternalServerErrorResponse({
    title: 'ArgumentInvalidException',
    detail: 'Property cannot be empty',
  })
  @ApiServiceUnavailableErrorResponse({
    title: 'CreateImmediateChargeException',
    detail: 'failed to create imediate cob on Celcoin',
  })
  async handle(
    @Body() data: CreateImmediateChargeInput,
  ): Promise<CreateImmediateChargeOutput> {
    const result = await this.createImmediateChargeUseCase.execute(
      CreateImmediateChargeInput.mapToUseCaseInput(data),
    );
    return CreateImmediateChargeOutput.mapFromUseCaseOutput(result);
  }
}
