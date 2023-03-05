import { CACHE_MANAGER } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Cache } from 'cache-manager';

import { ICacheManager } from '@domain/core';

import { CacheManager } from './cache-manager';

const fakeCachaData = { any: 'any' };
describe('CacheManager', () => {
  let cacheManager: ICacheManager;
  let cache: Cache;
  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        CacheManager,
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
          },
        },
      ],
      imports: [],
    }).compile();
    cacheManager = app.get<ICacheManager>(CacheManager);
    cache = app.get<Cache>(CACHE_MANAGER);
  });

  it('should be defined', () => {
    expect(cacheManager).toBeDefined();
    expect(cache).toBeDefined();
  });

  it('should be set cache successfully', async () => {
    jest.spyOn(cache, 'set').mockImplementation();
    const result = await cacheManager.set('key', fakeCachaData, 1000);
    expect(result).toBeUndefined();
  });

  it('should be set cache successfully', async () => {
    jest
      .spyOn(cache, 'get')
      .mockImplementation(() => Promise.resolve(fakeCachaData));
    const result = await cacheManager.get('key');
    expect(result).toEqual(fakeCachaData);
  });
});
