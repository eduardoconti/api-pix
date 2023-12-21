import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
//import { PrismaService } from '@infra/database/prisma';
import * as Sentry from '@sentry/node';
import { ProfilingIntegration } from '@sentry/profiling-node';

import { BaseException } from '@domain/exceptions';

import {
  BaseExceptionFilter,
  HttpExceptionFilter,
  UnknownExceptionFilter,
} from '@infra/exception-filter';
import { LoggingInterceptor } from '@infra/interceptors';
import { ValidationPipe } from '@infra/pipes';

import { EnvironmentVariables } from './main/config';
import { MainModule } from './main/main.module';

async function bootstrap() {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('elastic-apm-node').start({
    // Override the service name from package.json
    // Allowed characters: a-z, A-Z, 0-9, -, _, and space
    serviceName: 'api-pix',

    // Set the custom APM Server URL (default: http://localhost:8200)
    serverUrl: 'http://apm-server:8200',

    // Set the service environment
    environment: 'teste',
  });
  const app = await NestFactory.create(MainModule);

  const logger = app.get(Logger);
  app.useGlobalInterceptors(new LoggingInterceptor(logger));
  app.useGlobalFilters(new UnknownExceptionFilter(logger));
  app.useGlobalFilters(new BaseExceptionFilter(logger));
  app.useGlobalFilters(new HttpExceptionFilter(logger));

  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: '*',
  });

  //const prismaService = app.get(PrismaService);
  //await prismaService.enableShutdownHooks(app);

  const configService = app.get(ConfigService<EnvironmentVariables>);
  const config = new DocumentBuilder()
    .setTitle('API Pix')
    .setDescription('API para gerar QrCode e processar pagamentos com `PIX`')
    .setVersion('1.0')
    .addServer(`http://localhost:${configService.get('PORT')}`, 'Local')
    .addServer(`https://api-pix-qx46.onrender.com`, 'Production')
    .addTag('health-check', 'Endpoints para monitoramento da api')
    .addTag('auth', 'Endpoints para autenticação')
    .addTag('user', 'Endpoints para gerenciamento de usuário')
    .addTag('charge', 'Endpoints para gerenciamento de cobrança pix')
    .addTag('webhook', 'Endpoints para gerenciamento de webhook')
    .addBearerAuth({
      type: 'http',
      description: 'Todos os endpoints precisam do token de acesso!',
    })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  Sentry.init({
    dsn: 'https://7f10d55838db4eefb674b71e6d903f82:ad0ec3ca2dce406cb25f5606d0f15a9d@o1201158.ingest.sentry.io/4504836716888064',
    tracesSampleRate: 1.0,
    profilesSampleRate: 1.0, // Profiling sample rate is relative to tracesSampleRat
    integrations: [
      new Sentry.Integrations.Http({ tracing: true }),
      new Sentry.Integrations.Express(),
      new ProfilingIntegration(),
      new Sentry.Integrations.Mongo({useMongoose: true}),
    ],
    attachStacktrace: true,
    environment: process.env.NODE_ENV,
    beforeSend(event, hint) {
      const exception = hint?.originalException;
      if (exception instanceof BaseException) {
        event.extra = {
          message: exception.message,
          metadata: exception?.metadata,
        };
      }

      return event;
    },
  });

  app.use(Sentry.Handlers.requestHandler());
  app.use(Sentry.Handlers.tracingHandler());
  app.use(Sentry.Handlers.errorHandler());

  await app.listen(configService.get('PORT') | 3000);
}
bootstrap();
