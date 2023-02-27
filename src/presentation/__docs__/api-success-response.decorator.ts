import { applyDecorators, HttpStatus, Type } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

type Props<TModel> = {
  model: TModel;
  statusCode?: HttpStatus;
  isArray?: boolean;
};
export const ApiSuccessResponse = <TModel extends Type<any>>(
  props: Props<TModel>,
) => {
  return applyDecorators(
    ApiResponse({
      type: props.model,
      status: props.statusCode ?? HttpStatus.OK,
      isArray: props.isArray,
    }),
  );
};
