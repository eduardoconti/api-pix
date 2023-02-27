import { Test, TestingModule } from '@nestjs/testing';

import { HealthCheckController } from './health-check.controller';

describe('HealthCheckController', () => {
  let appController: HealthCheckController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [HealthCheckController],
    }).compile();

    appController = app.get<HealthCheckController>(HealthCheckController);
  });

  describe('HealthCheckController', () => {
    it('should execute successfully', () => {
      expect(appController.handle()).toBe('app is running');
    });
  });
});
