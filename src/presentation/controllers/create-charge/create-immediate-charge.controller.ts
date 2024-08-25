import {
  Body,
  Controller,
  HttpStatus,
  Inject,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { TokenPayload } from '@app/contracts';
import {
  CelcoinImmediateChargeCreator,
  CreateImmediateCharge,
  ICreateImmediateChargeUseCase,
  IImmediateChargeCreatorStrategy,
} from '@app/use-cases';

import { User } from '@infra/decorators/user.decorator';
import { JwtAuthGuard } from '@infra/guard';

import {
  ApiInternalServerErrorResponse,
  ApiServiceUnavailableErrorResponse,
  ApiSuccessResponse,
  ApiUnauthorizedErrorResponse,
} from '@presentation/__docs__';
import {
  CreateImmediateChargeRequest,
  CreateImmediateChargeResponse,
} from '@presentation/dto';
@ApiTags('charge')
@Controller('immediate-charge')
@ApiBearerAuth()
export class CreateImmediateChargeController {
  constructor(
    @Inject(CreateImmediateCharge)
    private readonly createImmediateChargeUseCase: ICreateImmediateChargeUseCase,
    @Inject(CelcoinImmediateChargeCreator)
    private readonly celcoinImmediateChargeCreatorStrategy: IImmediateChargeCreatorStrategy,
  ) {}
  @Post()
  @ApiSuccessResponse({
    model: CreateImmediateChargeResponse,
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
  @ApiUnauthorizedErrorResponse({
    title: 'InvalidTokenException',
    detail: 'Invalid token',
  })
  @ApiOperation({
    summary: 'Cria cobrança imediata',
  })
  @UseGuards(JwtAuthGuard)
  async handle(
    @Body() data: CreateImmediateChargeRequest,
    @User() user: TokenPayload,
  ): Promise<CreateImmediateChargeResponse> {
    this.createImmediateChargeUseCase.setStrategy(
      this.celcoinImmediateChargeCreatorStrategy,
    );
    const result = await this.createImmediateChargeUseCase.execute(
      CreateImmediateChargeRequest.mapToUseCaseInput({
        ...data,
        userId: user.userId,
      }),
    );
    return CreateImmediateChargeResponse.mapFromUseCaseOutput(result);
  }
}
