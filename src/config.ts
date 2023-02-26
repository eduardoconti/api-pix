import * as Joi from 'joi';

export interface EnvironmentVariables {
  PORT: number;
}

export const configValidationSchema = Joi.object({
  // APP
  PORT: Joi.number().required().default(3000),
});
