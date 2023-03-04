import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

export type ApiErrorResponseProps = {
  title: string;
  status: number;
  detail: string;
  type?: string;
};
export const ApiErrorResponse = (props: ApiErrorResponseProps) => {
  return applyDecorators(
    ApiResponse({
      status: props.status,
      description: props.title,
      schema: {
        title: props.title,
        properties: {
          status: { example: props.status, type: 'number' },
          title: { example: props.title, type: 'string' },
          detail: { example: props.detail, type: 'string' },
          type: { example: props?.type ?? 'about:blank', type: 'string' },
        },
        required: ['status', 'title', 'detail', 'type'],
      },
    }),
  );
};
