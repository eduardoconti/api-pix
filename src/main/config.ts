import * as Joi from 'joi';

export interface EnvironmentVariables {
  PORT: number;
  DB_HOST: string;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_NAME: string;
  DATABASE_URL: string;
  CELCOIN_PIX_KEY: string;
  CELCOIN_CLIENT_ID: string;
  CELCOIN_CLIENT_SECRET: string;
  CELCOIN_HOST: string;
  REDIS_HOST: number;
  REDIS_PORT: string;
}

export const configValidationSchema = Joi.object({
  // APP
  PORT: Joi.number().required().default(3000),
  // DB
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().required().default(5432),
  DB_USER: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_NAME: Joi.string().required(),
  DATABASE_URL: Joi.string().required(),
  // CELCOIN
  CELCOIN_PIX_KEY: Joi.string().required(),
  CELCOIN_CLIENT_ID: Joi.string().required(),
  CELCOIN_CLIENT_SECRET: Joi.string().required(),
  CELCOIN_HOST: Joi.string().required(),
  REDIS_HOST: Joi.string().required(),
  REDIS_PORT: Joi.number().required(),
});
