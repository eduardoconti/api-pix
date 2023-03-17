import {
  Body,
  Controller,
  HttpStatus,
  Inject,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { TokenPayload } from '@app/contracts';
import {
  CreateImmediateChargeUseCase,
  ICreateImmediateChargeUseCase,
} from '@app/use-cases';

import { User } from '@infra/decorators/user.decorator';
import { JwtAuthGuard } from '@infra/guard';

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
@ApiBearerAuth()
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
  @UseGuards(JwtAuthGuard)
  async handle(
    @Body() data: CreateImmediateChargeInput,
    @User() user: TokenPayload,
  ): Promise<CreateImmediateChargeOutput> {
    const result = await this.createImmediateChargeUseCase.execute(
      CreateImmediateChargeInput.mapToUseCaseInput({
        ...data,
        userId: user.userId,
      }),
    );
    return CreateImmediateChargeOutput.mapFromUseCaseOutput(result);
  }
}
