import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
@ApiTags('health-check')
@Controller()
export class HealthCheckController {
  @Get()
  @ApiOkResponse({
    description: 'Health check',
    schema: {
      type: 'string',
      example: 'app is running',
    },
  })
  @ApiOperation({
    summary: 'Health-check',
  })
  handle(): string {
    return 'app is running';
  }
}
