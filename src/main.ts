import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './main/main.module';
import { EnvironmentVariables } from './main/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService<EnvironmentVariables>);
  await app.listen(configService.get('PORT') | 3000);
}
bootstrap();
