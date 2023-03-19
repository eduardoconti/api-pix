import { SentryService } from '@ntegral/nestjs-sentry';

import { SentryMonitorError } from './sentry-monitor-error';

describe('SentryMonitorError', () => {
  let sentryMonitorError: SentryMonitorError;
  let mockClient: jest.Mocked<SentryService>;

  beforeEach(() => {
    mockClient = {
      instance: jest.fn().mockReturnThis(),
      captureException: jest.fn(),
    } as any;

    sentryMonitorError = new SentryMonitorError(mockClient);
  });

  describe('capture', () => {
    it('should call SentryService.captureException with the correct parameters', () => {
      const exception = new Error('Test error');
      const metadata = { foo: 'bar' };
      sentryMonitorError.capture(exception, metadata);
      expect(mockClient.instance).toHaveBeenCalledTimes(1);
      expect(mockClient.instance().captureException).toHaveBeenCalledTimes(1);
      expect(mockClient.instance().captureException).toHaveBeenCalledWith(
        exception,
        {
          extra: metadata,
        },
      );
    });
  });
});
