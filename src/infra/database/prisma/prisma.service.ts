import {
  INestApplication,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor(private readonly logService: Logger) {
    super({ log: ['info', 'warn', 'error'] });
  }

  async onModuleInit() {
    await this.$connect().catch((e: Error) => {
      this.logService.error(e.message);
    });
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
      await this.$disconnect();
    });
  }
}
