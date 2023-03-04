import { applyDecorators, HttpStatus } from '@nestjs/common';

import {
  ApiErrorResponse,
  ApiErrorResponseProps,
} from './api-error-response.decorator';

export const ApiServiceUnavailableErrorResponse = (
  props: Omit<ApiErrorResponseProps, 'status'>,
) => {
  return applyDecorators(
    ApiErrorResponse({
      status: HttpStatus.SERVICE_UNAVAILABLE,
      title: props.title,
      detail: props.detail,
    }),
  );
};
