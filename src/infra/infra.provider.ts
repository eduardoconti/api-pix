import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { EnvironmentVariables } from '@main/config';

import { CacheManager } from './cache';
import { CelcoinApi } from './celcoin';
import { HttpService, IHttpService } from './http-service';

export const provideCelcoinApi: Provider<CelcoinApi> = {
  provide: CelcoinApi,
  useFactory: (
    httpService: IHttpService,
    configService: ConfigService<EnvironmentVariables>,
    cacheManager: CacheManager,
  ) => {
    return new CelcoinApi(httpService, configService, cacheManager);
  },
  inject: [HttpService, ConfigService, CacheManager],
};
