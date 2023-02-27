import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import {
  CreateImmediateChargeUseCase,
  ICreateImmediateChargeUseCase,
} from '@app/use-cases';

import {
  ApiInternalServerErrorResponse,
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
  @ApiSuccessResponse({ model: CreateImmediateChargeOutput })
  @ApiInternalServerErrorResponse(
    'ArgumentNotProvidedException',
    'Property cannot be empty',
  )
  async handle(
    @Body() data: CreateImmediateChargeInput,
  ): Promise<CreateImmediateChargeOutput> {
    const result = await this.createImmediateChargeUseCase.execute(
      CreateImmediateChargeInput.mapToUseCaseInput(data),
    );
    return CreateImmediateChargeOutput.mapFromUseCaseOutput(result);
  }
}
