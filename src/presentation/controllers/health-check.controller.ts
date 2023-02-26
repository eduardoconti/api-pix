import { Controller, Get } from '@nestjs/common';

@Controller()
export class HealthCheckController {
  @Get()
  handle(): string {
    return 'app is running';
  }
}
