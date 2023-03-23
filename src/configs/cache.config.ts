import { CacheModuleOptions } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';

export const getCacheConfig = async (
  configService: ConfigService,
): Promise<CacheModuleOptions> => ({
  store: redisStore,
  host: configService.get('REDIS_HOST'),
  port: configService.get('REDIS_PORT'),
  ttl: configService.get('REDIS_TTL'),
});
