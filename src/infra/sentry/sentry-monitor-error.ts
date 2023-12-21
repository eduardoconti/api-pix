import { Injectable } from '@nestjs/common';
import * as Sentry from '@sentry/node';

import { IMonitorError } from '@app/contracts';

@Injectable()
export class SentryMonitorError implements IMonitorError {
  capture(exception: any, metadata?: any): void {
    Sentry.captureException(exception, { extra: metadata });
  }
}
