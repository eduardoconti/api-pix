import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ApiNoContentResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { IReceiveWebhookUseCase, ReceiveWebhookUseCase } from '@app/use-cases';

import { ApiInternalServerErrorResponse } from '@presentation/__docs__';
import { WebhookCelcoinInput } from '@presentation/dto';

@ApiTags('webhook')
@Controller('webhook')
export class ReceiveCelcoinWebhookController {
  constructor(
    @Inject(ReceiveWebhookUseCase)
    private readonly receiveWebhookUseCase: IReceiveWebhookUseCase,
  ) {}

  @Post('celcoin')
  @ApiOperation({
    summary: 'Recebimento webhook da celcoin',
    description: 'Rota para receber webhook pix da empresa celcoin',
  })
  @ApiNoContentResponse()
  @ApiInternalServerErrorResponse({
    title: 'WebhookRepositoryException',
    detail: 'database error',
  })
  async handle(@Body() data: WebhookCelcoinInput): Promise<void> {
    await this.receiveWebhookUseCase.execute(
      WebhookCelcoinInput.toUseCaseInput(data),
    );
  }
}
