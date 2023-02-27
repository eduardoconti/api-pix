import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { EnvironmentVariables } from './main/config';
import { AppModule } from './main/main.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService<EnvironmentVariables>);
  const config = new DocumentBuilder()
    .setTitle('API Pix')
    .setDescription('API para gerar QrCode e processar pagamentos com `PIX`')
    .setVersion('1.0')
    .addTag('health-check')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  await app.listen(configService.get('PORT') | 3000);
}
bootstrap();
