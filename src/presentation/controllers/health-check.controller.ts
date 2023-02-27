import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

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
  handle(): string {
    return 'app is running';
  }
}
