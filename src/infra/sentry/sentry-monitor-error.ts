import { Injectable } from '@nestjs/common';
import { InjectSentry, SentryService } from '@ntegral/nestjs-sentry';

import { IMonitorError } from '@app/contracts';

@Injectable()
export class SentryMonitorError implements IMonitorError {
  public constructor(@InjectSentry() private readonly client: SentryService) {}
  capture(exception: any, metadata?: any): void {
    this.client.instance().captureException(exception, { extra: metadata });
  }
}
