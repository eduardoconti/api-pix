import * as Sentry from '@sentry/node';

import { SentryMonitorError } from './sentry-monitor-error';

describe('SentryMonitorError', () => {
  let sentryMonitorError: SentryMonitorError;

  beforeEach(() => {
    sentryMonitorError = new SentryMonitorError();
  });

  describe('capture', () => {
    it('should call SentryService.captureException with the correct parameters', () => {
      jest.spyOn(Sentry, 'captureException');
      const exception = new Error('Test error');
      const metadata = { foo: 'bar' };
      sentryMonitorError.capture(exception, metadata);

      expect(Sentry.captureException).toHaveBeenCalledWith(exception, {
        extra: metadata,
      });
    });
  });
});
