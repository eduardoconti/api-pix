import * as Joi from 'joi';

export interface EnvironmentVariables {
  NODE_ENV: string;
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
  REDIS_PASSWORD: string;
  ELASTIC_HOST: number;
  ELASTIC_PORT: string;
  SENTRY_DSN: string;
  JWT_KEY: string;
  DB_MONGO_PORT: string;
  DB_MONGO_URI: string;
}

export const configValidationSchema = Joi.object({
  // APP
  PORT: Joi.number().required().default(3000),
  NODE_ENV: Joi.string().required(),
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
  // REDIS
  REDIS_HOST: Joi.string().required(),
  REDIS_PORT: Joi.number().required(),
  REDIS_PASSWORD: Joi.string().required(),
  //ELASTIC
  ELASTIC_HOST: Joi.string(),
  ELASTIC_PORT: Joi.number(),
  //SENTRY
  SENTRY_DSN: Joi.optional(),
  JWT_KEY: Joi.string().required(),
  //MONGO
  DB_MONGO_PORT: Joi.number().default(27017),
  DB_MONGO_URI: Joi.string().required(),
});
