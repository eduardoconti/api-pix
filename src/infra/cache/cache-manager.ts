import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

import { ICacheManager } from '@domain/core';

@Injectable()
export class CacheManager implements ICacheManager {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly nestCacheManager: Cache,
  ) {}

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    await this.nestCacheManager.set<T>(key, value, { ttl });
  }
  async get<T>(key: string): Promise<T> {
    return (await this.nestCacheManager.get<T>(key)) as T;
  }
}
