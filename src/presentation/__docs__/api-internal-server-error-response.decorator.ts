import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiInternalServerErrorResponse as SwaggerApiInternalServerErrorResponse } from '@nestjs/swagger';

export const ApiInternalServerErrorResponse = (
  title?: string,
  detail?: string,
  type?: string,
) => {
  return applyDecorators(
    SwaggerApiInternalServerErrorResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description: 'Internal Server Error',
      schema: {
        title: 'Internal Server Error',
        properties: {
          status: { example: HttpStatus.INTERNAL_SERVER_ERROR, type: 'number' },
          title: { example: title, type: 'string' },
          detail: { example: detail, type: 'string' },
          type: { example: type ?? 'about:blank', type: 'string' },
        },
        required: ['status', 'title', 'detail', 'type'],
      },
    }),
  );
};
