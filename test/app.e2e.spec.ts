import { INestApplication, Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

import { PrismaService } from '@infra/database/prisma';
import {
  BaseExceptionFilter,
  HttpExceptionFilter,
  UnknownExceptionFilter,
} from '@infra/exception-filter';
import { ValidationPipe } from '@infra/pipes';

import { MainModule } from '@main/main.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [MainModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    const logger = app.get(Logger);
    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalFilters(new UnknownExceptionFilter(logger));
    app.useGlobalFilters(new BaseExceptionFilter(logger));
    app.useGlobalFilters(new HttpExceptionFilter(logger));

    const prismaService = app.get(PrismaService);
    await prismaService.enableShutdownHooks(app);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer()).get('/').expect(200);
  });

  it('/immediate-charge (POST)', async () => {
    await request(app.getHttpServer())
      .post('/immediate-charge')
      .send({})
      .expect(400);
  });
});
